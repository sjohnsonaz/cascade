export default class VirtualNode {
    type: string;
    properties: Object;
    children: Array<VirtualNode | string>;
    element: Node;
    constructor(type: string, properties?: Object, ...children: Array<VirtualNode | string>) {
        this.type = type;
        this.properties = properties || {};
        this.children = children || [];
        this.element = document.createElement(this.type);
    }

    render() {
        var element = document.createElement(this.type);
        for (var name in this.properties) {
            if (this.properties.hasOwnProperty(name)) {
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
