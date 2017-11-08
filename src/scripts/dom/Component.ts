import Cascade from '../cascade/Cascade';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import ComponentNode from './ComponentNode';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import Diff, { DiffOperation } from '../util/Diff';

var componentContexts: Component<IVirtualNodeProps>[][] = [];
var context: Component<IVirtualNodeProps>[] = undefined;

export abstract class Component<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    // TODO: Remove unused uniqueId?
    uniqueId: number;
    props: T;
    children: any;
    key: string;
    root: any;
    element: Node;
    context: Component<IVirtualNodeProps>[];
    rendered: boolean = false;

    constructor(props?: T, ...children: any[]) {
        // TODO: Remove unused uniqueId?
        this.uniqueId = Math.floor(Math.random() * 1000000);
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    init() {
        // This should subscribe to all observables used by render.
        Cascade.createComputed(this, 'root', () => {
            // Dispose of old context
            this.disposeContext();

            // Push this to the current context
            if (context) {
                context.push(this);
            }

            // Create a new context
            Component.pushContext();

            // Render
            var root = this.render();

            // Store the new context
            this.context = Component.popContext();
            return root;
        });
        // Only update if we are re-rendering
        Cascade.subscribe(this, 'root', (root: any, oldRoot: any) => {
            if (this.rendered) {
                var element = this.element;
                this.toNode(oldRoot);
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
            }
        });
    }

    abstract render(): any;

    toNode(oldRoot?: any): Node {
        var root = Cascade.peek(this, 'root');
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
                        if (root instanceof Component) {
                            // Root is a Component
                            if (root.constructor === oldRoot.constructor && root.key === oldRoot.key) {
                                // Root and OldRoot are both the same Component - Diff this case
                                root.element = oldElement;
                                element = this.diffComponents(root, oldRoot, oldElement);
                                noDispose = true;
                            } else {
                                // Root is a different Component
                                element = root.toNode();
                            }
                        } else if (root.type) {
                            // Root is a VirtualNode
                            if (root.type === oldRoot.type && root.key === oldRoot.key) {
                                // Root and OldRoot are both the same VirtualNode - Diff this case
                                root.element = oldElement;
                                element = this.diffVirtualNodes(root, oldRoot, oldElement as HTMLElement);
                            } else {
                                // Root is a different VirtualNode
                                element = root.toNode();
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
                            element = root.toNode();
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

        if (!noDispose && oldRoot && oldRoot instanceof Component) {
            //oldRoot.dispose();
        }

        this.afterRender(element, this.rendered);

        if (!element) {
            element = document.createComment('Empty Component');
        }
        this.element = element;
        this.rendered = true;
        return element;
    }

    dispose() {
        var computed = Cascade.getObservable(this, 'root') as Computed<any>;
        computed.dispose(true);
        if (this.context) {
            for (var index = 0, length = this.context.length; index < length; index++) {
                let component = this.context[index];
                var computed = Cascade.getObservable(component, 'root') as Computed<any>;
                computed.dispose(true);
                component.dispose();
            }
        }
        this.afterDispose(this.element);
    }

    disposeContext() {
        if (this.context) {
            for (var index = 0, length = this.context.length; index < length; index++) {
                let component = this.context[index];
                var computed = Cascade.getObservable(component, 'root') as Computed<any>;
                computed.dispose(true);
                component.dispose();
            }
        }
    }

    afterRender(node: Node, updating: boolean) {

    }

    afterDispose(node: Node) {

    }

    diffComponents(newRoot: Component<IVirtualNodeProps>, oldRoot: Component<IVirtualNodeProps>, oldElement: Node) {
        var output: Node;
        var innerRoot = Cascade.peek(newRoot, 'root');
        var innerOldRoot = Cascade.peek(oldRoot, 'root');

        // Update new root as rendered
        newRoot.rendered = true;

        if (!innerOldRoot) {
            // We are replacing
            switch (typeof innerRoot) {
                case 'object':
                    if (innerRoot) {
                        if (innerRoot.toNode) {
                            output = innerRoot.toNode();
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
                        if (innerRoot instanceof Component) {
                            // InnerRoot is a Component
                            if (innerOldRoot instanceof Component && innerRoot.constructor === innerOldRoot.constructor && innerRoot.key === innerOldRoot.key) {
                                // InnerRoot is the same Component as InnerOldRoot - Diff this case
                                output = this.diffComponents(innerRoot, innerOldRoot, oldElement);
                            } else {
                                // Replace
                                output = innerRoot.toNode();
                            }
                        } else if (innerRoot instanceof VirtualNode) {
                            if (innerOldRoot instanceof VirtualNode && innerRoot.type === innerOldRoot.type && innerRoot.key === innerOldRoot.key) {
                                // InnerRoot is the same VirtualNode as InnerOldRoot - Diff this case
                                output = this.diffVirtualNodes(innerRoot, innerOldRoot, oldElement as HTMLElement);
                            } else {
                                // Replace
                                output = innerRoot.toNode();
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

        // Call the ref for newRoot
        if (newRoot.props.ref) {
            newRoot.props.ref(output);
        }

        newRoot.afterRender(output, true);

        return output;
    }

    diffVirtualNodes(newRoot: VirtualNode<IVirtualNodeProps>, oldRoot: VirtualNode<IVirtualNodeProps>, oldElement: HTMLElement) {
        // TODO: This case should not happen.
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            // We are cleanly replacing
            oldElement = newRoot.toNode();
        } else {
            // Old and New Roots match
            var diff = Diff.compare(oldRoot.children, newRoot.children, compareVirtualNodes);
            var propertyDiff = Diff.compareHash(oldRoot.props, newRoot.props);
            var isSvg = !!oldElement.getAttribute('xmlns');
            for (var name in propertyDiff) {
                if (propertyDiff.hasOwnProperty(name)) {
                    var property = propertyDiff[name];
                    if (property === null) {
                        VirtualNode.removeAttribute(oldElement, name, isSvg);
                    } else {
                        VirtualNode.setAttribute(oldElement, name, property, isSvg);
                    }
                }
            }
            var childIndex = oldRoot.children.length - 1;
            for (var index = 0, length = diff.length; index < length; index++) {
                var diffItem = diff[index];
                switch (diffItem.operation) {
                    case DiffOperation.REMOVE:
                        oldElement.removeChild(oldElement.childNodes[childIndex]);
                        childIndex--;
                        break;
                    case DiffOperation.NONE:
                        var newChild = diffItem.itemB;
                        var oldChild = diffItem.item;
                        // Diff recursively
                        // TODO: Remove extra casts
                        if (typeof newChild === 'object') {
                            if (newChild instanceof Component) {
                                newChild.element = oldElement.childNodes[childIndex];
                                this.diffComponents(newChild, oldChild, oldElement.childNodes[childIndex] as HTMLElement);
                            } else if (newChild instanceof VirtualNode) {
                                // TODO: This is the only case where we don't know if oldChild exists and has the same type as newChild.
                                // Perhaps we should figure that out here intead of inside diffVirtualNodes.
                                this.diffVirtualNodes(newChild as any, oldChild as any, oldElement.childNodes[childIndex] as HTMLElement);
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
                                        newElement = (newChild as any).toNode();
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
        return context;
    }

    static pushContext() {
        context = [];
        componentContexts.unshift(context);
        return context;
    }

    static popContext() {
        var oldContext = componentContexts.shift();
        context = componentContexts[0];
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
                        if (nodeA instanceof Component) {
                            return nodeA.constructor === nodeB.constructor;
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
