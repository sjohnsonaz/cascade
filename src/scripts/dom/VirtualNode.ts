import { Component } from './Component';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';

export default class VirtualNode<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    type: string;
    props: T;
    children: any;
    key: string;
    element: Node;

    constructor(type: string, props?: T, ...children: Array<any>) {
        this.type = type;
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    static fixChildrenArrays(children: Array<any>, fixedChildren?: any[]) {
        fixedChildren = fixedChildren || [];
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            // Remove undefined elements
            if (typeof child !== 'undefined') {
                if (child instanceof Array) {
                    VirtualNode.fixChildrenArrays(child, fixedChildren);
                } else {
                    fixedChildren.push(child);
                }
            }
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
                case 'object':
                    if (child) {
                        if ((child as IVirtualNode<any>).toNode) {
                            var renderedNode = (child as IVirtualNode<any>).toNode();
                            if (renderedNode instanceof Node) {
                                node.appendChild(renderedNode);
                            }
                        } else {
                            node.appendChild(document.createTextNode(child.toString()));
                        }
                    }
                case 'undefined':
                    break;
                // case 'number':
                default:
                    node.appendChild(document.createTextNode(child.toString()));
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
        if (property === 'style') {
            element.style.cssText = value;
        } else if (property.indexOf('on') >= 0) {
            element[property] = value;
        } else if (property === 'className') {
            element[property] = value;
            //} else if (property.indexOf('-') >= 0) {
        } else {
            element.setAttribute(property, value);
        }
    }

    static removeAttribute(element: HTMLElement, property: string) {
        if (property === 'style') {
            element.style.cssText = undefined;
        } else if (property.indexOf('on') >= 0) {
            element[property] = undefined;
        } else if (property === 'className') {
            element[property] = undefined;
            //} else if (property.indexOf('-') >= 0) {
        } else {
            element.removeAttribute(property);
        }
    }
}
