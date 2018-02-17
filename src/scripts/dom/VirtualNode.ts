import { IVirtualNode, IVirtualElementProps } from './IVirtualNode';

export default class VirtualNode<T> implements IVirtualNode<T> {
    type: string;
    props: T & IVirtualElementProps;
    children: any;
    key: string;
    element: Node;

    constructor(type: string, props?: T & IVirtualElementProps, ...children: Array<any>) {
        this.type = type;
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    toNode() {
        let node: HTMLElement;
        if (this.props.xmlns) {
            // Casting potential Element to HtmlElement.
            node = document.createElementNS(this.props.xmlns, this.type) as any;
        } else {
            node = document.createElement(this.type);
        }
        let isSvg = !!this.props.xmlns;
        for (var name in this.props) {
            if (this.props.hasOwnProperty(name)) {
                let value = this.props[name];
                if (value !== undefined && value !== null) {
                    VirtualNode.setAttribute(node, name, this.props[name], isSvg);
                }
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
                    break;
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

    static fixChildrenArrays(children: Array<any>, fixedChildren?: any[]) {
        fixedChildren = fixedChildren || [];
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            // Remove undefined and null elements
            if (typeof child !== 'undefined' && child !== null) {
                if (child instanceof Array) {
                    VirtualNode.fixChildrenArrays(child, fixedChildren);
                } else {
                    fixedChildren.push(child);
                }
            }
        }
        return fixedChildren;
    }

    static setAttribute(element: HTMLElement, property: string, value: any, isSvg: boolean = false) {
        if (!isSvg) {
            if (property === 'style') {
                element.style.cssText = value;
            } else if (property.indexOf('-') >= 0) {
                element.setAttribute(property, value);
            } else if (property === 'class') {
                element.setAttribute(property, value);
            } else {
                try {
                    element[property] = value;
                } catch (e) {
                    element.setAttribute(property, value);
                }
            }
        } else {
            if (property === 'style') {
                element.style.cssText = value;
            } else if (property.indexOf('on') >= 0) {
                element[property] = value;
            } else if (property === 'className') {
                element[property] = value;
            } else {
                element.setAttribute(property, value);
            }
        }
    }

    // TODO: Should we both set to empty string and delete?
    static removeAttribute(element: HTMLElement, property: string, isSvg: boolean = false) {
        if (!isSvg) {
            if (property === 'style') {
                element.style.cssText = undefined;
            } else if (property.indexOf('-') >= 0) {
                element.removeAttribute(property);
            } else if (property === 'class') {
                element.removeAttribute(property);
            } else {
                try {
                    element[property] = '';
                    delete element[property];
                } catch (e) {
                    element.removeAttribute(property);
                }
            }
        } else {
            if (property === 'style') {
                element.style.cssText = undefined;
            } else if (property.indexOf('on') >= 0) {
                element[property] = '';
                delete element[property];
            } else if (property === 'className') {
                element[property] = '';
                delete element[property];
            } else {
                element.removeAttribute(property);
            }
        }
    }
}
