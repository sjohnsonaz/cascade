import Cascade from './Cascade';

export default class VirtualNode<T extends Object> {
    type: string;
    properties: T;
    children: Array<VirtualNode<any> | string>;
    node: VirtualNode<any> | string;
    element: Node;
    private hiddenElement: Node;
    constructor(type: string, properties?: T, ...children: Array<VirtualNode<any> | string>) {
        var self = this;
        this.type = type;
        this.properties = properties || ({} as any);
        this.children = children || [];
        Cascade.createComputed(this, 'node', function() {
            return self.render();
        }, true);
        Cascade.createComputed(this, 'element', function(oldValue) {
            var root = self.node;
            var element: Node;
            if (typeof root === 'string') {
                if (!oldValue || !(oldValue instanceof Text)) {
                    element = document.createTextNode(root);
                } else {
                    element = oldValue;
                    (element as HTMLElement).textContent = root;
                }
            } else {
                if (!oldValue || !(oldValue instanceof HTMLElement) || (oldValue as HTMLElement).tagName.toLowerCase() !== root.type) {
                    element = document.createElement(root.type);
                } else {
                    element = oldValue;
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }
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
                        element.appendChild((child as any)._graph.observables.element.peek());
                    }
                }
            }
            return element;
        }, true);
    }

    render(): VirtualNode<any> | string {
        return this;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.element);
        return container.innerHTML;
    }
}
