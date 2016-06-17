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
        var root = this.render();
        var element: Node;
        if (typeof root === 'string') {
            element = document.createTextNode(root);
        } else {
            element = document.createElement(root.type);
            for (var name in root.properties) {
                if (root.properties.hasOwnProperty(name)) {
                    element[name] = root.properties[name];
                }
            }
            for (var index = 0, length = root.children.length; index < length; index++) {
                var child = root.children[index];
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child as string));
                } else {
                    element.appendChild(child.toNode())
                }
            }
        }
        return element;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.toNode());
        return container.innerHTML;
    }
}
