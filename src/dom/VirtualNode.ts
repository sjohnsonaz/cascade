import { IVirtualNode, IVirtualElementProps } from './IVirtualNode';
import Cascade from '../cascade/Cascade';

export default class VirtualNode<T> implements IVirtualNode<T> {
    type: string;
    props: T & IVirtualElementProps;
    children: any[];
    key: string | number;
    element: Node;

    constructor(type: string, props?: T & IVirtualElementProps, children?: Array<any>) {
        this.type = type;
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children;
    }

    toNode(namespace?: string) {
        let node: HTMLElement;
        namespace = namespace || this.props.xmlns;
        if (namespace) {
            // Casting potential Element to HtmlElement.
            node = document.createElementNS(namespace, this.type) as any;
        } else {
            node = document.createElement(this.type);
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
                            var renderedNode = (child as IVirtualNode<any>).toNode(namespace);
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
        for (var name in this.props) {
            if (this.props.hasOwnProperty(name)) {
                let value = this.props[name];
                if (value !== undefined && value !== null) {
                    VirtualNode.setAttribute(node, name, this.props[name], namespace);
                }
            }
        }
        if (this.props && this.props.ref) {
            if (typeof this.props.ref === 'function') {
                this.props.ref(node);
            } else {
                this.props.ref.current = node;
            }
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
        if (children) {
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
        }
        return fixedChildren;
    }

    static createCssText(style: Partial<CSSStyleDeclaration>) {
        let dest = [];
        for (let index in style) {
            if (style.hasOwnProperty(index)) {
                let name = index.replace(/$([a-z])$([A-Z])/, stringReplacer);
                let value = style[index];
                if (value !== undefined && value !== null) {
                    dest.push(name + ': ' + value);
                }
            }
        }
        return dest.join('; ');
    }

    static setAttribute(element: HTMLElement, property: string, value: any, namespace?: string) {
        if (!namespace) {
            if (property === 'style') {
                if (typeof value === 'string') {
                    element.style.cssText = value;
                } else {
                    element.style.cssText = this.createCssText(value);
                }
            } else if (property.indexOf('-') >= 0) {
                element.setAttribute(property, value);
            } else if (property === 'class') {
                element.setAttribute(property, value);
            } else if (property === 'role') {
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
            } else if (property.indexOf('on') === 0) {
                element[property] = value;
            } else if (property === 'className') {
                element[property] = value;
            } else if (property === 'href') {
                // TODO: Remove once Safari fixes href                
                if (Cascade.xlinkDeprecated) {
                    element.setAttribute('href', value);
                } else {
                    element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
                }
            } else {
                element.setAttribute(property, value);
            }
        }
    }

    // TODO: Should we both set to empty string and delete?
    static removeAttribute(element: HTMLElement, property: string, namespace?: string) {
        if (!namespace) {
            if (property === 'style') {
                element.style.cssText = undefined;
            } else if (property.indexOf('-') >= 0) {
                element.removeAttribute(property);
            } else if (property === 'class') {
                element.removeAttribute(property);
            } else if (property === 'role') {
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
            } else if (property === 'xmlns') {
                // do nothing
            } else {
                element.removeAttribute(property);
            }
        }
    }
}

function stringReplacer(match: string, lowerLetter: string, upperLetter: string) {
    return lowerLetter + '-' + upperLetter.toLowerCase();
}