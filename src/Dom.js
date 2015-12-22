var Dom = (function () {
    function Dom() {}

    Dom.createElement = function (type, attributes, contents) {
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
        return element;
    };

    Dom.renderForEach = function (data, template) {
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

    Dom.createTemplate = function (template) {

    }

    Dom.mountRoot = function (element, contents) {
        // Append children
        if (contents !== undefined) {
            var contents = Array.prototype.splice.call(arguments, 1);
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
        return element;
    };

    return Dom;
})();
