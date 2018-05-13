import Cascade from '../cascade/Cascade';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import ComponentNode from './ComponentNode';
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
    key: string;
    root: any;
    element: Node;
    context: ComponentNode<any>[];
    oldContext: ComponentNode<any>[];
    mounted: boolean = false;
    rendered: boolean = false;

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
        var root = Cascade.peek(this, 'root');

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
                                element = this.diffComponents(root, oldRoot, oldElement, namespace);
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
            this.props.ref(element);
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

    beforeRender(updating: boolean) {

    }

    afterRender(node: Node, updating: boolean) {

    }

    afterDispose(node: Node) {

    }

    diffComponents(newRootComponentNode: ComponentNode<IVirtualNodeProps>, oldRootComponentNode: ComponentNode<IVirtualNodeProps>, oldElement: Node, namespace: string) {
        var output: Node;
        let oldRoot = oldRootComponentNode.component;
        oldRootComponentNode.component = undefined;
        newRootComponentNode.component = oldRoot;
        var innerOldRoot = Cascade.peekDirty(oldRoot, 'root');
        var innerRoot = oldRoot.update(newRootComponentNode.props, ...newRootComponentNode.children);

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
                                output = this.diffComponents(innerRoot, innerOldRoot, oldElement, namespace);
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
            oldRoot.props.ref(output);
        }

        oldRoot.afterRender(output, true);

        if (!output) {
            output = document.createComment('Empty Component');
        }

        // Swap root elements if necessary
        if (output !== oldElement && oldElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(output, oldElement);
        }

        oldRoot.element = output;

        return output;
    }

    diffVirtualNodes(newRoot: VirtualNode<IVirtualNodeProps>, oldRoot: VirtualNode<IVirtualNodeProps>, oldElement: HTMLElement, namespace: string) {
        // TODO: This case should not happen.
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            // We are cleanly replacing
            oldElement = newRoot.toNode(namespace);
        } else {
            // Old and New Roots match
            var diff = Diff.compare(oldRoot.children, newRoot.children, compareVirtualNodes);
            var propertyDiff = Diff.compareHash(oldRoot.props, newRoot.props);
            namespace = namespace || ((oldElement && oldElement.namespaceURI && oldElement.namespaceURI.endsWith('svg')) ? oldElement.namespaceURI : undefined)
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
            var childIndex = oldRoot.children.length - 1;
            for (var index = 0, length = diff.length; index < length; index++) {
                var diffItem = diff[index];
                switch (diffItem.operation) {
                    case DiffOperation.REMOVE:
                        var oldChild = diffItem.item;
                        oldElement.removeChild(oldElement.childNodes[childIndex]);
                        childIndex--;
                        break;
                    case DiffOperation.NONE:
                        var newChild = diffItem.itemB;
                        var oldChild = diffItem.item;
                        // Diff recursively
                        // TODO: Remove extra casts
                        if (typeof newChild === 'object') {
                            if (newChild instanceof ComponentNode) {
                                this.diffComponents(newChild, oldChild, oldElement.childNodes[childIndex] as HTMLElement, namespace);
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

            // Call the ref for newRoot
            if (newRoot.props.ref) {
                newRoot.props.ref(oldElement);
            }
        }
        return oldElement;
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
