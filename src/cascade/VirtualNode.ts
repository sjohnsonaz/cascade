export default class VirtualNode<T extends Object> {
    type: string;
    properties: T;
    children: Array<VirtualNode<any> | string>;
    element: Node;
    constructor(type: string, properties?: T, ...children: Array<VirtualNode<any> | string>) {
        this.type = type;
        this.properties = properties || ({} as any);
        this.children = children || [];
        this.element = document.createElement(this.type);
    }

    render(): VirtualNode<any> | string {
        return this;
    }

    toNode() {
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
                element.appendChild(child.toNode())
            }
        }
        return element;
    }

    toString() {
        var template = document.createElement('template') as HTMLTemplateElement;
        template.appendChild(this.toNode());
        return template.innerHTML;
    }
}
