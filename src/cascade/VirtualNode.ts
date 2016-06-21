import Graph from '../graph/Graph';

export default class VirtualNode<T extends Object> {
    type: string;
    properties: T;
    children: Array<VirtualNode<any> | string>;
    oldNode: VirtualNode<any> | string;
    node: VirtualNode<any> | string;
    element: Node;
    constructor(type: string, properties?: T, ...children: Array<VirtualNode<any> | string>) {
        var self = this;
        this.type = type;
        this.properties = properties || ({} as any);
        this.children = children || [];
        Graph.createComputed(this, 'node', function() {
            return self.render();
        }, true);
        var element: Node = undefined;
        var oldNode: VirtualNode<any> | string;
        Graph.createComputed(this, 'element', function() {
            var root = self.node;
            // First render
            if (!element) {
                if (typeof root === 'string') {
                    element = document.createTextNode(root);
                } else {
                    element = document.createElement(root.type);
                    element = self.diff(element, root);
                }
            } else {
                if (typeof root === 'string') {
                    if (!(element instanceof (Text))) {
                        element = document.createTextNode(root);
                    } else {
                        element.textContent = root;
                    }
                } else {
                    if ((element as HTMLElement).tagName.toLowerCase() !== self.type) {
                        element = document.createElement(self.type);
                    }
                    element = self.diff(element, root, oldNode);
                }
            }
            oldNode = root;
            return element;
        }, true);
    }

    render(): VirtualNode<any> | string {
        return this;
    }

    diff(parent: Node, node: VirtualNode<any>, oldNode?: VirtualNode<any> | string) {
        return node.toNode();
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
                    element.appendChild(child.element)
                }
            }
        }
        return element;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.element);
        return container.innerHTML;
    }
}
