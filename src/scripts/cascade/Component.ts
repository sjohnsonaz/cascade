import Cascade from './Cascade';
import Computed from '../graph/Computed';
import VirtualNode from './VirtualNode';
import {IVirtualNode, IVirtualNodeProperties} from './IVirtualNode';
import Diff, {DiffOperation} from './Diff';

var componentContexts: Component<any>[][] = [];
var context: Component<any>[] = undefined;

export default class Component<T extends IVirtualNodeProperties> implements IVirtualNode<T> {
    uniqueId: number;
    properties: T;
    children: Array<IVirtualNode<any> | string | number>;
    root: IVirtualNode<any> | string | number;
    element: Node;
    context: Component<any>[];

    constructor(properties?: T, ...children: Array<IVirtualNode<any> | string | number>) {
        this.uniqueId = Math.floor(Math.random() * 1000000);
        this.properties = properties || ({} as any);
        this.children = children || [];
        // This should subscribe to all observables used by render.
        Cascade.createComputed(this, 'root', () => {
            // Dispose of old context
            if (this.context) {
                for (var index = 0, length = this.context.length; index < length; index++) {
                    var computed = Cascade.getObservable(this.context[index], 'root') as Computed<any>;
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
        Cascade.subscribe(this, 'root', (root: VirtualNode<any> | string | number, oldRoot: VirtualNode<any> | string | number) => {
            if (oldRoot) {
                var element = this.element;
                this.renderToNode(oldRoot);
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

    renderToNode(oldRoot?: VirtualNode<any> | string | number): Node {
        var root = Cascade.peek(this, 'root');
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
                    // TODO: Improve Component type checking
                    if (root instanceof Component) {
                        root.element = oldElement;
                        element = this.diff(Cascade.peek(root, 'root'), Cascade.peek(oldRoot, 'root'), oldElement);
                        //element = root.renderToNode(Cascade.peek(oldRoot, 'root'));
                    } else {
                        root.element = oldElement;
                        element = this.diff(root as VirtualNode<any>, oldRoot as VirtualNode<any>, oldElement);
                        //element = (root as any).toNode();
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
                    if (root instanceof Component) {
                        element = root.renderToNode();
                    } else {
                        element = (root as any).toNode();
                    }
                    break;
            }
        }

        if (element !== oldElement) {
            if (this.properties && this.properties.ref) {
                this.properties.ref(element);
            }
        }

        this.element = element;
        return element;
    }

    toNode() {
        var root = this.root;
        var element: Node;
        if (typeof root === 'string') {
            element = document.createTextNode(root);
        } else if (typeof root === 'number') {
            element = document.createTextNode(root.toString());
        } else {
            if (root instanceof Component) {
                element = Cascade.peek(root, 'element');
            } else {
                element = root.toNode();
            }
        }
        if (this.properties && this.properties.ref) {
            this.properties.ref(element);
        }
        return element;
    }

    diff(newRoot: VirtualNode<any>, oldRoot: VirtualNode<any>, oldElement: Node) {
        if (!oldRoot || oldRoot.type !== newRoot.type) {
            return newRoot.toNode();
        } else {
            // Old and New Roots match
            var diff = Diff.compare(oldRoot.children, newRoot.children, compareVirtualNodes);
            var childIndex = oldRoot.children.length - 1;
            for (var index = 0, length = diff.length; index < length; index++) {
                var diffItem = diff[index];
                switch (diffItem.operation) {
                    case DiffOperation.REMOVE:
                        oldElement.removeChild(oldElement.childNodes[childIndex]);
                        childIndex--;
                        break;
                    case DiffOperation.NONE:
                        var newChild = diffItem.item;
                        // Diff recursively
                        if (typeof newChild === 'object') {
                            if (newChild instanceof Component) {
                                newChild.element = oldElement;
                                this.diff(Cascade.peek(newChild, 'root') as any, Cascade.peek(oldRoot.children[childIndex], 'root') as any, oldElement.childNodes[childIndex]);
                            } else {
                                this.diff(newChild as any, oldRoot.children[childIndex] as any, oldElement.childNodes[childIndex]);
                            }
                        }
                        childIndex--;
                        break;
                    case DiffOperation.ADD:
                        var newChild = diffItem.item;
                        switch (typeof newChild) {
                            case 'string':
                                oldElement.appendChild(document.createTextNode(newChild as string));
                                break;
                            case 'number':
                                oldElement.appendChild(document.createTextNode(newChild.toString()));
                                break;
                            case 'object':
                                if (newChild instanceof Component) {
                                    oldElement.appendChild((newChild as any).renderToNode());
                                } else {
                                    oldElement.appendChild((newChild as any).toNode());
                                }
                                break;
                        }
                        break;
                }
            }
            return newRoot.toNode(oldElement);
            //return oldElement;
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
                return (nodeA as VirtualNode<any>).type === (nodeB as VirtualNode<any>).type;
        }
    } else {
        return false;
    }
}
