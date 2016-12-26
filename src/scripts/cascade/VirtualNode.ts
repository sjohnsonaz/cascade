import Component from './Component';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';

export default class VirtualNode<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    type: string;
    props: T;
    children: Array<IVirtualNode<any> | string | number>;
    key: string;
    element: Node;

    constructor(type: string, props?: T, ...children: Array<IVirtualNode<any> | string | number>) {
        this.type = type;
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? this.fixChildrenArrays(children) : [];
    }

    private fixChildrenArrays(children: Array<IVirtualNode<any> | string | number>) {
        var fixedChildren = [];
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            // Remove undefined elements
            //if (typeof child !== 'undefined') {
            if (child instanceof Array) {
                for (var childIndex = 0, childLength = (child as any).length; childIndex < childLength; childIndex++) {
                    fixedChildren.push(child[childIndex]);
                }
            } else {
                fixedChildren.push(child);
            }
            //}
        }
        return fixedChildren;
    }

    toNode() {
        var node = document.createElement(this.type);
        for (var name in this.props) {
            if (this.props.hasOwnProperty(name)) {
                VirtualNode.setAttribute(node, name, this.props[name]);
            }
        }
        for (var index = 0, length = this.children.length; index < length; index++) {
            var child = this.children[index];
            switch (typeof child) {
                case 'string':
                    node.appendChild(document.createTextNode(child as string));
                    break;
                case 'number':
                    node.appendChild(document.createTextNode(child.toString()));
                    break;
                case 'object':
                    if (child) {
                        if ((child as IVirtualNode<any>).toNode) {
                            node.appendChild((child as IVirtualNode<any>).toNode());
                        } else {
                            node.appendChild(document.createTextNode(child.toString()));
                        }
                    }
                default:
                    break;
            }
        }
        if (this.props && this.props.ref) {
            this.props.ref(node);
        }
        this.element = node;
        return node;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.toNode());
        return container.innerHTML;
    }

    static setAttribute(element: HTMLElement, property: string, value: any) {
        if (property.indexOf('-') >= 0) {
            element.setAttribute(property, value);
        } else {
            try {
                element[property] = value;
            } catch (e) {
                element.setAttribute(property, value);
            }
        }
    }

    static removeAttribute(element: HTMLElement, property: string) {
        if (property.indexOf('-') >= 0) {
            element.removeAttribute(property);
        } else {
            try {
                element[property] = undefined;
            } catch (e) {
                element.removeAttribute(property);
            }
        }
    }
}
