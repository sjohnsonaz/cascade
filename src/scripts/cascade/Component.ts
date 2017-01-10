import Graph from '../graph/Graph';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import Diff, { DiffOperation } from './Diff';

var componentContexts: Component<any>[][] = [];
var context: Component<any>[] = undefined;

export abstract class Component<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    uniqueId: number;
    props: T;
    children: any;
    key: string;
    root: any;
    element: Node;
    context: Component<any>[];

    constructor(props?: T, ...children: any[]) {
        this.uniqueId = Math.floor(Math.random() * 1000000);
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children || [];
    }

    init() {
        // This should subscribe to all observables used by render.
        Graph.createComputed(this, 'root', () => {
            // Dispose of old context
            if (this.context) {
                for (var index = 0, length = this.context.length; index < length; index++) {
                    var computed = Graph.getObservable(this.context[index], 'root') as Computed<any>;
                    computed.dispose();
                }
            }

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
        Graph.subscribe(this, 'root', (root: any, oldRoot: any) => {
            if (oldRoot) {
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
        var root = Graph.peek(this, 'root');
        var oldElement = this.element;

        var element: Node;
        var rootType = typeof root;

        // Test if we must diff.
        // If we have an old root, we have rendered before.
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
                        // Diff this case
                        if (root instanceof Component) {
                            if (root.constructor === oldRoot.constructor) {
                                root.element = oldElement;
                                element = this.diff(Graph.peek(root, 'root'), Graph.peek(oldRoot, 'root'), oldElement as HTMLElement);
                            } else {
                                element = root.toNode();
                            }
                        } else if (root.type) {
                            if (root.type == (oldRoot as VirtualNode<any>).type) {
                                root.element = oldElement;
                                element = this.diff(root as VirtualNode<any>, oldRoot as VirtualNode<any>, oldElement as HTMLElement);
                            } else {
                                element = root.toNode();
                            }
                        } else {
                            element = document.createTextNode(root.toString());
                        }
                    }
                    break;
                case 'undefined':
                    break;
                // Number and anything else    
                // case 'number':
                default:
                    if (root !== oldRoot) {
                        element = document.createTextNode(root.toString());
                    } else {
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
                    break;
                case 'undefined':
                    break;
                // Number and anything else
                // case 'number':
                default:
                    element = document.createTextNode(root.toString());
                    break;
            }
        }

        if (element !== oldElement) {
            if (this.props && this.props.ref) {
                this.props.ref(element);
            }
        }

        this.element = element;
        return element;
    }

    diff(newRoot: any, oldRoot: any, oldElement: HTMLElement) {
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            switch (typeof newRoot) {
                case 'object':
                    if (newRoot) {
                        if (newRoot.toNode) {
                            return newRoot.toNode();
                        } else {
                            return newRoot.toString();
                        }
                    }
                    break;
                case 'string':
                    return newRoot;
                case 'undefined':
                    break;
                default:
                    return newRoot.toString();
            }
        } else {
            // Old and New Roots match
            var diff = Diff.compare(oldRoot.children, newRoot.children, compareVirtualNodes);
            var propertyDiff = Diff.compareHash(oldRoot.props, newRoot.props);
            for (var name in propertyDiff) {
                if (propertyDiff.hasOwnProperty(name)) {
                    var property = propertyDiff[name];
                    if (property === null) {
                        VirtualNode.removeAttribute(oldElement, name);
                    } else {
                        VirtualNode.setAttribute(oldElement, name, property);
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
                                this.diff(Graph.peek(newChild, 'root') as any, Graph.peek(oldChild, 'root') as any, oldElement.childNodes[childIndex] as HTMLElement);
                            } else if (newChild instanceof VirtualNode) {
                                this.diff(newChild as any, oldChild as any, oldElement.childNodes[childIndex] as HTMLElement);
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
            //return newRoot.toNode(oldElement);
            return oldElement;
        }
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
        switch (typeA) {
            case 'object':
                if (nodeA && (nodeA as any).toNode && (nodeB as any).toNode) {
                    if ((nodeA as IVirtualNode<any>).key === (nodeB as IVirtualNode<any>).key) {
                        if (nodeA instanceof Component) {
                            return nodeA.constructor === nodeB.constructor;
                        } else {
                            return (nodeA as VirtualNode<any>).type === (nodeB as VirtualNode<any>).type;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return nodeA === nodeB;
                }
            // case 'string':
            // case 'number':
            default:
                return nodeA === nodeB;
        }
    } else {
        return false;
    }
}
