var DomRenderer = (function() {
    function DomRenderer(context) {
        Object.defineProperty(this, 'context', {
            value: context
        });
    }

    DomRenderer.prototype = {
        createElement: function(type, attributes, contents) {
            // Create element
            var element = document.createElement(type);

            // Apply attributes
            if (attributes) {
                for (var index in attributes) {
                    if (attributes.hasOwnProperty(index)) {
                        element[index] = attributes[index];
                    }
                }
            }

            // Append children
            if (contents !== undefined) {
                var contents = Array.prototype.splice.call(arguments, 2);
                var fragment = document.createDocumentFragment();
                for (var index = 0, length = contents.length; index < length; index++) {
                    var content = contents[index];
                    if (content instanceof Node) {
                        fragment.appendChild(content);
                    } else {
                        fragment.appendChild(document.createTextNode(content));
                    }
                }
                element.appendChild(fragment);
            }
            this.context.managedChildren.push(element);
            return element;
        },
        create: function() {
            var result = Object.create(this.prototype, Build.debug ? {
                constructor: {
                    value: this
                }
            } : undefined);
            result = this.apply(result, arguments) || result;
            result.init.apply(result, arguments);
            return result;
        },
        createComponent: function(component) {
            var args = Array.prototype.splice.call(arguments, 1);
            component.call(window, args)
            this.context.managedChildren.push(element);

        },
        renderForEach: function(data, template) {
            var fragment = document.createDocumentFragment();
            for (var index = 0, length = data.length; index < length; index++) {
                var content = data[index];
                if (template) {
                    var render = template(content, data, index);
                    if (render instanceof Node) {
                        fragment.appendChild(render);
                    } else {
                        fragment.appendChild(document.createTextNode(render));
                    }
                } else {
                    if (content instanceof Node) {
                        fragment.appendChild(content);
                    } else {
                        fragment.appendChild(document.createTextNode(content));
                    }
                }
            }
            return fragment;
        }
    };

    return DomRenderer;
})();
