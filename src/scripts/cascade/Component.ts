import Graph from '../graph/Graph';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import Diff, { DiffOperation } from './Diff';

var componentContexts: Component<any>[][] = [];
var context: Component<any>[] = undefined;

export default class Component<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    uniqueId: number;
    props: T;
    children: Array<IVirtualNode<any> | string | number>;
    key: string;
    root: IVirtualNode<any> | string | number;
    element: Node;
    context: Component<any>[];

    constructor(props?: T, ...children: Array<IVirtualNode<any> | string | number>) {
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
        Graph.subscribe(this, 'root', (root: VirtualNode<any> | string | number, oldRoot: VirtualNode<any> | string | number) => {
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

    render(): IVirtualNode<any> | string | number {
        return this;
    }

    toNode(oldRoot?: VirtualNode<any> | string | number): Node {
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
                case 'number':
                    if (root !== oldRoot) {
                        element = document.createTextNode(root.toString());
                    } else {
                        element = oldElement;
                    }
                    break;
                default:
                    // Diff this case
                    if (root instanceof Component) {
                        if (root.constructor === oldRoot.constructor) {
                            root.element = oldElement;
                            element = this.diff(Graph.peek(root, 'root'), Graph.peek(oldRoot, 'root'), oldElement as HTMLElement);
                        } else {
                            element = root.toNode();
                        }
                    } else {
                        if (root.type = (oldRoot as VirtualNode<any>).type) {
                            root.element = oldElement;
                            element = this.diff(root as VirtualNode<any>, oldRoot as VirtualNode<any>, oldElement as HTMLElement);
                        } else {
                            element = root.toNode();
                        }
                    }
                    break;
            }
        } else {
            switch (rootType) {
                case 'string':
                    element = document.createTextNode(root as string);
                    break;
                case 'number':
                    element = document.createTextNode(root.toString());
                    break;
                default:
                    element = root.toNode();
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

    diff(newRoot: VirtualNode<any>, oldRoot: VirtualNode<any>, oldElement: HTMLElement) {
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            return newRoot.toNode();
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
                        switch (typeof newChild) {
                            case 'string':
                                newElement = document.createTextNode(newChild as string);
                                break;
                            case 'number':
                                newElement = document.createTextNode(newChild.toString());
                                break;
                            case 'object':
                                newElement = (newChild as any).toNode();
                                break;
                        }
                        oldElement.insertBefore(newElement, oldElement.childNodes[childIndex + 1]);
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

function compareVirtualNodes(nodeA: VirtualNode<any> | string | number, nodeB: VirtualNode<any> | string | number) {
    var typeA = typeof nodeA;
    var typeB = typeof nodeB;
    if (typeA === typeB) {
        switch (typeA) {
            case 'string':
            case 'number':
                return nodeA === nodeB;
            case 'object':
                if ((nodeA as IVirtualNode<any>).key === (nodeB as IVirtualNode<any>).key) {
                    if (nodeA instanceof Component) {
                        return nodeA.constructor === nodeB.constructor;
                    } else {
                        return (nodeA as VirtualNode<any>).type === (nodeB as VirtualNode<any>).type;
                    }
                } else {
                    return false;
                }
        }
    } else {
        return false;
    }
}
