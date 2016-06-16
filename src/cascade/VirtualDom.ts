export default class VirtualDom {
    constructor() {

    }

    static updateDom(html: Node, oldDom: DomNode, newDom: DomNode) {

    }

    static createElement(type: string, properties?: Object, ...children: Array<DomNode | string>) {
        return new DomNode(type, properties, ...children);
    }
}

export class DomNode {
    readonly type: string;
    properties: Object;
    children: Array<DomNode | string>;
    element: Node;
    constructor(type: string, properties?: Object, ...children: Array<DomNode | string>) {
        this.type = type,
        this.properties = properties || {};
        this.children = children || [];
        this.element = document.createElement(this.type);
    }

    render() {
        var element = document.createElement(this.type);
        for (var name in this.properties) {
            if (this.properties.hasOwnProperty(name)){
                element[name] = this.properties[name];
            }
        }
        for (var index = 0, length = this.children.length; index < length; index++) {
            var child = this.children[index];
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child as string));
            } else {
                element.appendChild(child.render())
            }
        }
        return element;
    }
}

export function Dom(type: string, properties: Object, children) {
}
