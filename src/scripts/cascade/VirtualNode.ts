import Cascade from './Cascade';
import Component from './Component';
import {IVirtualNode, IVirtualNodeProperties} from './IVirtualNode';

export default class VirtualNode<T extends IVirtualNodeProperties> implements IVirtualNode<T> {
    type: string;
    properties: T;
    children: Array<IVirtualNode<any> | string | number>;
    element: Node;

    constructor(type: string, properties?: T, ...children: Array<IVirtualNode<any> | string | number>) {
        this.type = type;
        this.properties = properties || ({} as any);
        this.children = children ? this.fixChildrenArrays(children) : [];
    }

    fixChildrenArrays(children: Array<IVirtualNode<any> | string | number>) {
        var fixedChildren = [];
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            if (child) {
                if (child instanceof Array) {
                    for (var childIndex = 0, childLength = (child as any).length; childIndex < childLength; childIndex++) {
                        fixedChildren.push(child[childIndex]);
                    }
                } else {
                    fixedChildren.push(child);
                }
            }
        }
        return fixedChildren;
    }

    toNode(oldValue?: Node) {
        var node: Node;
        if (!oldValue || !(oldValue instanceof HTMLElement) || (oldValue as HTMLElement).tagName.toLowerCase() !== this.type) {
            node = document.createElement(this.type);
        } else {
            node = oldValue;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
        for (var name in this.properties) {
            if (this.properties.hasOwnProperty(name)) {
                node[name] = this.properties[name];
            }
        }
        for (var index = 0, length = this.children.length; index < length; index++) {
            var child = this.children[index];
            if (child) {
                if (typeof child === 'string') {
                    node.appendChild(document.createTextNode(child));
                } else if (typeof child === 'number') {
                    node.appendChild(document.createTextNode(child.toString()));
                } else {
                    if (child instanceof Component) {
                        node.appendChild(Cascade.peek(child, 'element'));
                    } else {
                        node.appendChild(child.toNode());
                    }
                }
            }
        }
        if (this.properties && this.properties.ref) {
            this.properties.ref(node);
        }
        this.element = node;
        return node;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.toNode());
        return container.innerHTML;
    }
}
