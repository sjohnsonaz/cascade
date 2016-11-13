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
        var oldRoot = undefined;
        Cascade.createComputed(this, 'element', (oldElement: Node) => {
            // Subscribe to root
            var root = this.root;
            var element: Node;
            if (typeof root === 'string') {
                element = document.createTextNode(root);
            } else if (typeof root === 'number') {
                element = document.createTextNode(root.toString());
            } else {
                if (root instanceof Component) {
                    // Do not subscribe to root element
                    element = Cascade.peek(root, 'element');
                } else {
                    if (!oldElement) {
                        element = root.toNode();
                    } else {
                        // Diff this case
                        element = this.diff(root as VirtualNode<any>, oldRoot, oldElement);
                    }
                }
            }
            if (element !== oldElement) {
                if (this.properties && this.properties.ref) {
                    this.properties.ref(element);
                }
            }
            oldRoot = root;
            return element;
        });
        // Only update parent node if the element has changed
        Cascade.subscribe(this, 'element', (element: Node, oldElement: Node) => {
            if (oldElement) {
                var parentNode = oldElement.parentNode;
                if (parentNode) {
                    if (element) {
                        parentNode.replaceChild(element, oldElement);
                    } else {
                        parentNode.removeChild(element);
                    }
                }
            }
        });
    }

    render(): IVirtualNode<any> | string | number {
        return this;
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
            for (var index = diff.length - 1; index >= 0; index--) {
                var diffItem = diff[index];
                switch (diffItem.operation) {
                    case DiffOperation.REMOVE:
                        oldElement.removeChild(oldElement.childNodes[childIndex]);
                        childIndex--;
                        break;
                    case DiffOperation.NONE:
                        // Diff recursively
                        if (typeof diffItem.item === 'object') {
                            this.diff(oldRoot.children[childIndex] as any, diffItem.item as any, oldElement.childNodes[childIndex]);
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
                                oldElement.appendChild((newChild as any).toNode());
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
