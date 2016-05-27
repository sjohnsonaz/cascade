var Template = (function () {
    function Template(text) {
        this.fragment = parse(text);
    }

    Template.prototype = {
        build: function (data) {
            var node = this.fragment.cloneNode(true);
            return node;
        }
    };

    function parse(text) {
        text = replaceControlStatements(text);
        var fragment = createTemplateFragment(text);
        createBindings(fragment);
        return fragment;
    }

    function replaceControlStatements(text) {
        return text.replace(/\@([^{]*)\{([^}]*)\}|\@([a-zA-Z0-9]*)/g, function (match, $1, $2, $3, offset, string) {
            if ($3) {
                return '<!-- ' + $3.trim() + ' -->';
            } else {
                return '\
                    <!-- bind ' + $1.trim() + ' -->\r' +
                    $2.trim() + '\r' +
                    '<!-- /bind -->';
            }
        });
    }

    function createTemplateFragment(text) {
        var template = document.createElement('template');
        template.innerHTML = text;
        var fragment = template.content;
        if (!fragment) {
            var fragment = document.createDocumentFragment();
            while (template.firstChild) {
                fragment.appendChild(template.firstChild);
            }
        }
        return fragment;
    }

    function createBindings(node) {
        if (node instanceof Comment) { // node.nodeType === Node.COMMENT_NODE
            var commentText = node.textContent.trim();
            if (commentText.startsWith('bind ')) {
                node.binding = createBindingEval(commentText.substring(5));
            } else if (commentText.startsWith('/bind')) {
                node.binding = 'close';
            }
        } else {
            if (node.attributes) {
                var dataBind = node.attributes['data-bind'];
                if (dataBind) {
                    node.removeAttribute('data-bind');
                    node.binding = createBindingEval(dataBind.value);
                }
            }
            var nest = [];
            Array.prototype.slice.call(node.childNodes).forEach(function (currentValue, index, array) {
                createBindings(currentValue);
                if (currentValue instanceof Comment && currentValue.binding) {
                    if (currentValue.binding !== 'close') {
                        currentValue.fragment = document.createDocumentFragment();
                        currentValue.fragment.binding = currentValue.binding;
                        if (nest[0]) {
                            node.removeChild(currentValue);
                            nest[0].fragment.appendChild(currentValue);
                        }
                        nest.unshift(currentValue);
                    } else {
                        nest.shift();
                    }
                } else {
                    if (nest[0]) {
                        node.removeChild(currentValue);
                        nest[0].fragment.appendChild(currentValue);
                    }
                }
            });
        }
    }

    function createBindingEval(code) {
        return new Function('$values', '\r\
            with ($values) {\r\
                return ({' + code + '});\r\
            }\r\
        ');
    };

    Template.parse = parse;
    Template.createBindingEval = createBindingEval;

    return Template;
})();
