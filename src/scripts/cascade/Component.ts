import Cascade from './Cascade';
import VirtualNode from './VirtualNode';
import {IVirtualNode} from './IVirtualNode';

export default class Component<T extends Object> implements IVirtualNode<T> {
    properties: T;
    children: Array<IVirtualNode<any> | string>;
    root: IVirtualNode<any> | string;
    element: Node;

    constructor(properties?: T, ...children: Array<IVirtualNode<any> | string>) {
        this.properties = properties || ({} as any);
        this.children = children || [];
        Cascade.createComputed(this, 'root', () => {
            return this.render();
        }, true);
        Cascade.createComputed(this, 'element', () => {
            return this.toNode();
        }, true);
        /*
        Cascade.subscribe(this, 'element', (element: Node) => {
            var oldElement = this.element;
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
        */
    }

    render(): IVirtualNode<any> | string {
        return this;
    }

    toNode() {
        var root = this.root;
        var element: Node;
        if (typeof root === 'string') {
            element = document.createTextNode(root);
        } else {
            if (root instanceof Component) {
                element = root.element;
            } else {
                element = root.toNode();
            }
        }
        return element;
    }
}
