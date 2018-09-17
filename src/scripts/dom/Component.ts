import Cascade from '../cascade/Cascade';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import ComponentNode from './ComponentNode';
import Fragment from './Fragment';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import Diff, { DiffOperation } from '../util/Diff';

// Store ComponentContext in window to prevent multiple Cascade instance problem.
export interface IComponentContext {
    componentContexts: ComponentNode<IVirtualNodeProps>[][];
    context: ComponentNode<IVirtualNodeProps>[];
}
var componentContext: IComponentContext = window['$_cascade_component_context'] || {};
window['$_cascade_component_context'] = componentContext;
componentContext.componentContexts = componentContext.componentContexts || [];
componentContext.context = componentContext.context || undefined;

export abstract class Component<T> implements IVirtualNode<T> {
    // TODO: Remove unused uniqueId?
    uniqueId: number;
    props: T & IVirtualNodeProps;
    prevProps: T & IVirtualNodeProps;
    children: any;
    key: string | number;
    root: any;
    element: Node;
    context: ComponentNode<any>[];
    oldContext: ComponentNode<any>[];
    mounted: boolean = false;
    rendered: boolean = false;
    portal: boolean = false;

    constructor(props?: T & IVirtualNodeProps, ...children: any[]) {
        // TODO: Remove unused uniqueId?
        this.uniqueId = Math.floor(Math.random() * 1000000);
        this.storeProps(props, ...children);
    }

    storeProps(props?: T & IVirtualNodeProps, ...children: any[]) {
        this.prevProps = this.props;
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
        this.afterProps(this.mounted);
    }

    build() {
        // Store old context
        this.oldContext = this.context;

        // Create a new context
        Component.pushContext();

        // Render
        var root = this.render();

        // Store the new context
        this.context = Component.popContext();
        return root;
    }

    init() {
        // This should subscribe to all observables used by render.
        Cascade.createComputed(this, 'root', () => {
            Cascade.wrapContext(() => {
                this.beforeRender(this.mounted);
            });
            return this.build();
        });
        // Only update if we are re-rendering
        Cascade.subscribe(this, 'root', (root: any, oldRoot: any) => {
            if (this.rendered) {
                var element = this.element;
                // Get namespace from current element
                // If element is an svg, use undefined, as it may change
                // Otherwise, assume the namespace comes from parent
                let namespace;
                if (element && element.nodeName !== 'svg') {
                    let namespaceURI = element.namespaceURI;
                    namespace = (namespaceURI && namespaceURI.endsWith('svg')) ? namespaceURI : undefined;
                }
                this.toNode(namespace, oldRoot);

                // Dispose of old context
                this.disposeContext();

                if (element !== this.element) {
                    if (element) {
                        var parentNode = element.parentNode;
                        if (parentNode) {
                            if (this.element) {
                                parentNode.replaceChild(this.element, element);
                            } else {
                                parentNode.removeChild(element);
                            }
                        }
                    }
                }
            } else {
                this.rendered = true
            }
        });
    }

    update(props?: T & IVirtualNodeProps, ...children: any[]) {
        this.storeProps(props, ...children);
        this.rendered = false;
        return Cascade.update(this, 'root');
    }

    abstract render(): any;

    toNode(namespace?: string, oldRoot?: any): Node {
        // Get root
        var root = Cascade.peek(this, 'root') as any;

        // Store old element
        var oldElement = this.element;

        var element: Node;
        var rootType = typeof root;

        var noDispose: boolean = false;

        // Test if we must diff.
        // If we have an old root, we may need to diff.
        if (oldRoot && typeof oldRoot === rootType) {
            switch (rootType) {
                case 'string':
                    if (root !== oldRoot) {
                        element = document.createTextNode(root as string);
                    } else {
                        element = oldElement;
                    }
                    break;
                case 'object':
                    if (root) {
                        if (root instanceof ComponentNode) {
                            // Root is a Component
                            if (root.componentConstructor === oldRoot.componentConstructor && root.key === oldRoot.key) {
                                // Root and OldRoot are both the same Component - Diff this case
                                if (oldRoot.component instanceof Fragment) {
                                    element = this.diffFragments(root, oldRoot, oldElement, namespace);
                                } else {
                                    element = this.diffComponents(root, oldRoot, namespace);
                                    swapChildren(element, oldElement);
                                }
                                noDispose = true;
                            } else {
                                // Root is a different Component
                                element = root.toNode(namespace);
                            }
                        } else if (root.type) {
                            // Root is a VirtualNode
                            if (root.type === oldRoot.type && root.key === oldRoot.key) {
                                // Root and OldRoot are both the same VirtualNode - Diff this case
                                root.element = oldElement;
                                element = this.diffVirtualNodes(root, oldRoot, oldElement as HTMLElement, namespace);
                            } else {
                                // Root is a different VirtualNode
                                element = root.toNode(namespace);
                            }
                        } else {
                            // Root is an Object
                            element = document.createTextNode(root.toString());
                        }
                        // Ignore Null
                    }
                    break;
                case 'undefined':
                    // Ignore Undefined    
                    break;
                // Number and anything else    
                // case 'number':
                default:
                    if (root !== oldRoot) {
                        // Render to a string
                        element = document.createTextNode(root.toString());
                    } else {
                        // Root and OldRoot are the same
                        element = oldElement;
                    }
                    break;
            }
        } else {
            switch (rootType) {
                case 'string':
                    element = document.createTextNode(root as string);
                    break;
                case 'object':
                    if (root) {
                        if (root.toNode) {
                            element = root.toNode(namespace);
                        } else {
                            element = document.createTextNode(root.toString());
                        }
                    }
                    // Ignore Null
                    break;
                case 'undefined':
                    // Ignore Undefined    
                    break;
                // Number and anything else
                // case 'number':
                default:
                    element = document.createTextNode(root.toString());
                    break;
            }
        }

        if (this.props && this.props.ref) {
            if (typeof this.props.ref === 'function') {
                this.props.ref(element);
            } else {
                this.props.ref.current = element;
            }
        }

        if (!noDispose && oldRoot && oldRoot instanceof ComponentNode) {
            //oldRoot.dispose();
        }

        this.afterRender(element, this.mounted);

        if (!element) {
            element = document.createComment('Empty Component');
        }
        this.element = element;
        this.rendered = true;
        this.mounted = true;

        if (this.portal) {
            element = document.createComment('Empty Component');
        }

        return element;
    }

    dispose() {
        var computed = Cascade.getObservable(this, 'root') as Computed<any>;
        computed.dispose();
        if (this.context) {
            for (var index = 0, length = this.context.length; index < length; index++) {
                let component = this.context[index];
                component.dispose();
            }
        }
        this.afterDispose(this.element);
    }

    disposeContext() {
        if (this.oldContext) {
            for (var index = 0, length = this.oldContext.length; index < length; index++) {
                let component = this.oldContext[index];
                component.dispose();
            }
        }
    }

    afterProps(updating: boolean) {

    }

    beforeRender(updating: boolean) {

    }

    afterRender(node: Node, updating: boolean) {

    }

    afterDispose(node: Node) {

    }

    diffFragments(newRootComponentNode: ComponentNode<IVirtualNodeProps>, oldRootComponentNode: ComponentNode<IVirtualNodeProps>, oldElement: Node, namespace: string, offsetIndex: number = 0) {
        var output: Node;
        let oldRoot: Fragment = oldRootComponentNode.component as any;
        oldRootComponentNode.component = undefined;
        newRootComponentNode.component = oldRoot as any;

        oldRoot.update(newRootComponentNode.props, ...newRootComponentNode.children);
        this.diffVirtualNodes(oldRoot as any, oldRoot as any, oldElement as any, namespace, offsetIndex);

        return oldElement;
    }

    diffComponents(newRootComponentNode: ComponentNode<IVirtualNodeProps>, oldRootComponentNode: ComponentNode<IVirtualNodeProps>, namespace: string) {
        // No diff necessary.  We have the exact same Components
        if (newRootComponentNode === oldRootComponentNode) {
            return oldRootComponentNode.component.element;
        }

        // We have already rendered newRootComponentNode.  It is likely a child Component.
        if (newRootComponentNode.component) {
            return newRootComponentNode.component.element;
        }

        var output: Node;
        let oldRoot = oldRootComponentNode.component;
        let oldElement = oldRoot.element;

        // This should never happen
        if (!oldRoot) {
            throw 'Old Component has never been rendered.  Replacing with new Component.';
        }

        oldRootComponentNode.component = undefined;
        newRootComponentNode.component = oldRoot;

        let innerOldRoot = Cascade.peekDirty(oldRoot, 'root');
        let innerRoot = oldRoot.update(newRootComponentNode.props, ...newRootComponentNode.children);

        if (!innerOldRoot) {
            // We are replacing
            switch (typeof innerRoot) {
                case 'object':
                    if (innerRoot) {
                        if (innerRoot.toNode) {
                            output = innerRoot.toNode(namespace);
                        } else {
                            output = document.createTextNode(innerRoot.toString());
                        }
                    }
                    break;
                case 'undefined':
                    break;
                default:
                    output = document.createTextNode(innerRoot.toString());
            }
        } else {
            switch (typeof innerRoot) {
                case 'object':
                    if (innerRoot) {
                        // InnerRoot is not Null
                        if (innerRoot instanceof ComponentNode) {
                            // InnerRoot is a Component
                            if (innerOldRoot instanceof ComponentNode && innerRoot.componentConstructor === innerOldRoot.componentConstructor && innerRoot.key === innerOldRoot.key) {
                                // InnerRoot is the same Component as InnerOldRoot - Diff this case
                                if (innerOldRoot.component instanceof Fragment) {
                                    output = this.diffFragments(innerRoot, innerOldRoot, oldElement, namespace);
                                } else {
                                    output = this.diffComponents(innerRoot, innerOldRoot, namespace);
                                    swapChildren(output, oldElement);
                                }
                            } else {
                                // Replace
                                output = innerRoot.toNode(namespace);
                                // Dispose innerOldRoot
                                innerOldRoot.dispose();
                            }
                        } else if (innerRoot instanceof VirtualNode) {
                            if (innerOldRoot instanceof VirtualNode && innerRoot.type === innerOldRoot.type && innerRoot.key === innerOldRoot.key) {
                                // InnerRoot is the same VirtualNode as InnerOldRoot - Diff this case
                                output = this.diffVirtualNodes(innerRoot, innerOldRoot, oldElement as HTMLElement, namespace);
                            } else {
                                // Replace
                                output = innerRoot.toNode(namespace);
                            }
                        }
                    }
                    // Ignore Null
                    break;
                case 'undefined':
                    // Ignore Undefined    
                    break;
                case 'string':
                    if (innerRoot === innerOldRoot) {
                        // InnerRoot is the same as InnerOldRoot
                        output = oldElement;
                    } else {
                        // Replace
                        output = document.createTextNode(innerRoot);
                    }
                    break;
                default:
                    if (innerRoot === innerOldRoot) {
                        // InnerRoot is the same as InnerOldRoot
                        output = oldElement;
                    } else {
                        // Replace
                        output = document.createTextNode(innerRoot.toString());
                    }
            }
        }

        // Call the ref for oldRoot
        if (oldRoot.props.ref) {
            if (typeof oldRoot.props.ref === 'function') {
                oldRoot.props.ref(output);
            } else {
                oldRoot.props.ref.current = output;
            }
        }

        if (oldRoot.afterRender) {
            oldRoot.afterRender(output, true);
        }

        if (!output) {
            output = document.createComment('Empty Component');
        }

        oldRoot.element = output;

        if (oldRoot.portal) {
            output = document.createComment('Empty Component');
        }

        return output;
    }

    diffVirtualNodes(newRoot: VirtualNode<IVirtualNodeProps>, oldRoot: VirtualNode<IVirtualNodeProps>, oldElement: HTMLElement, namespace: string, offsetIndex?: number) {
        // TODO: This case should not happen.
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            // We are cleanly replacing
            oldElement = newRoot.toNode(namespace);
        } else if (newRoot === oldRoot) {
            // No diff necessary.  We have the exact same VirtualNodes
        } else {
            // Old and New Roots match
            var diff = Diff.compare(oldRoot.children, newRoot.children, compareVirtualNodes);
            var propertyDiff = Diff.compareHash(oldRoot.props, newRoot.props);
            namespace = namespace || ((oldElement && oldElement.namespaceURI && oldElement.namespaceURI.endsWith('svg')) ? oldElement.namespaceURI : undefined)
            var childIndex = oldRoot.children.length - 1 + (offsetIndex || 0);
            for (var index = 0, length = diff.length; index < length; index++) {
                var diffItem = diff[index];
                switch (diffItem.operation) {
                    case DiffOperation.REMOVE:
                        var oldChild = diffItem.item;
                        // We need to know if oldChild is a Fragment or a Component with a root Fragment
                        if (oldChild.component && oldChild.component.element.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                            let fragmentLength = oldChild.component.getChildLength();
                            let fragmentIndexLength = fragmentLength + childIndex;
                            for (let fragmentIndex = childIndex; fragmentIndex < fragmentIndexLength; fragmentIndex++) {
                                oldElement.removeChild(oldElement.childNodes[fragmentIndex]);
                            }
                            childIndex -= fragmentLength;
                        } else {
                            oldElement.removeChild(oldElement.childNodes[childIndex]);
                            childIndex--;
                        }
                        break;
                    case DiffOperation.NONE:
                        var newChild = diffItem.itemB;
                        var oldChild = diffItem.item;
                        // Diff recursively
                        // TODO: Remove extra casts
                        if (typeof newChild === 'object') {
                            if (newChild instanceof ComponentNode) {
                                if (oldChild.component instanceof Fragment) {
                                    this.diffVirtualNodes(newChild as any, oldChild, oldElement.childNodes[childIndex] as HTMLElement, namespace, childIndex);
                                } else {
                                    let newNode = this.diffComponents(newChild, oldChild, namespace);
                                    swapChildren(newNode, oldElement.childNodes[childIndex] as HTMLElement, oldElement, childIndex);
                                }
                            } else if (newChild instanceof VirtualNode) {
                                // TODO: This is the only case where we don't know if oldChild exists and has the same type as newChild.
                                // Perhaps we should figure that out here intead of inside diffVirtualNodes.
                                this.diffVirtualNodes(newChild as any, oldChild as any, oldElement.childNodes[childIndex] as HTMLElement, namespace);
                            }
                        }
                        childIndex--;
                        break;
                    case DiffOperation.ADD:
                        var newChild = diffItem.item;
                        var newElement;
                        // TODO: Null and Undefined should never happen
                        switch (typeof newChild) {
                            case 'string':
                                newElement = document.createTextNode(newChild as string);
                                oldElement.insertBefore(newElement, oldElement.childNodes[childIndex + 1]);
                                break;
                            case 'object':
                                if (newChild) {
                                    if ((newChild as any).toNode) {
                                        newElement = (newChild as any).toNode(namespace);
                                    } else {
                                        newElement = document.createTextNode(newChild.toString());
                                    }
                                    oldElement.insertBefore(newElement, oldElement.childNodes[childIndex + 1]);
                                }
                                break;
                            // case 'undefined':
                            // break;
                            // Number and anything else
                            // case 'number':
                            default:
                                newElement = document.createTextNode(newChild.toString());
                                oldElement.insertBefore(newElement, oldElement.childNodes[childIndex + 1]);
                                break;
                        }
                        break;
                }
            }

            for (var name in propertyDiff) {
                if (propertyDiff.hasOwnProperty(name)) {
                    var property = propertyDiff[name];
                    if (property === null) {
                        VirtualNode.removeAttribute(oldElement, name, namespace);
                    } else {
                        VirtualNode.setAttribute(oldElement, name, property, namespace);
                    }
                }
            }

            // Call the ref for newRoot
            if (newRoot.props.ref) {
                if (typeof newRoot.props.ref === 'function') {
                    newRoot.props.ref(oldElement);
                } else {
                    newRoot.props.ref.current = oldElement;
                }
            }
        }
        return oldElement;
    }

    getChildLength() {
        let root = Cascade.peekDirty(this, 'root') as any;
        if (root instanceof ComponentNode && root.component.getChildLength) {
            return root.component.getChildLength();
        } else {
            return 1;
        }
    }

    static getContext() {
        return componentContext.context;
    }

    static pushContext() {
        componentContext.context = [];
        componentContext.componentContexts.unshift(componentContext.context);
        return componentContext.context;
    }

    static popContext() {
        var oldContext = componentContext.componentContexts.shift();
        componentContext.context = componentContext.componentContexts[0];
        return oldContext;
    }
}

function compareVirtualNodes(nodeA: any, nodeB: any) {
    var typeA = typeof nodeA;
    var typeB = typeof nodeB;
    if (typeA === typeB) {
        // The two are of the same type
        switch (typeA) {
            case 'object':
                // If nodeA and nodeB are both IVirtualNodes
                if (nodeA && nodeB && (nodeA as any).toNode && (nodeB as any).toNode) {
                    if ((nodeA as IVirtualNode<IVirtualNodeProps>).key === (nodeB as IVirtualNode<IVirtualNodeProps>).key) {
                        if (nodeA instanceof ComponentNode) {
                            return nodeA.componentConstructor === nodeB.componentConstructor;
                        } else {
                            return (nodeA as VirtualNode<IVirtualNodeProps>).type === (nodeB as VirtualNode<IVirtualNodeProps>).type;
                        }
                    } else {
                        return false;
                    }
                } else {
                    // This covers null
                    return nodeA === nodeB;
                }
            // case 'undefined';
            // case 'string':
            // case 'number':
            default:
                return nodeA === nodeB;
        }
    } else {
        return false;
    }
}

function swapChildren(newNode: Node, oldNode: Node, parent?: HTMLElement, index?: number) {
    if (newNode) {
        if (newNode !== oldNode) {
            if (oldNode && oldNode.parentNode) {
                oldNode.parentNode.replaceChild(newNode, oldNode);
            } else if (parent) {
                parent.insertBefore(newNode, parent.childNodes[index + 1]);
            }
        }
    } else {
        if (oldNode && oldNode.parentNode) {
            oldNode.parentNode.removeChild(oldNode);
        }
    }
}