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
                    <!-- bind ' + $1.trim() + ' -->\r\n' +
                    $2.trim() + '\r\n' +
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
        var context = getContext();
        if (context) {
            context.children.push(node);
        }
        switch (node.nodeType) {
            case Node.COMMENT_NODE:
                var commentText = node.textContent.trim();
                var commentContext;
                if (commentText.startsWith('bind ')) {
                    commentContext = pushContext(node);
                    node.context = commentContext;
                    node.binding = createBindingEval(commentText.substring(5));
                } else if (commentText.startsWith('/bind')) {
                    commentContext = popContext();
                    if (!commentContext.virtual) {
                        throw 'Context mismatch';
                    }
                    var startComment = commentContext.node;
                    startComment.fragment = document.createDocumentFragment();
                    for (var contextIndex = 0, contextLength = commentContext.children.length; contextIndex < contextLength; contextIndex++) {
                        startComment.fragment.appendChild(commentContext.children[contextIndex]);
                    }
                }
                break;
            case Node.TEXT_NODE:
                break;
            case Node.DOCUMENT_FRAGMENT_NODE:
                if (node.childNodes.length) {
                    pushContext(node);
                    Array.prototype.slice.call(node.childNodes).forEach(function (currentValue, index, array) {
                        createBindings(currentValue);
                    });
                    popContext();
                }
                break;
            default:
                var dataBind;
                if (node.attributes) {
                    dataBind = node.attributes['data-bind'];
                    if (dataBind) {
                        node.removeAttribute('data-bind');
                        node.binding = createBindingEval(dataBind.value);
                    }
                }
                if (node.childNodes.length) {
                    pushContext(node);
                    Array.prototype.slice.call(node.childNodes).forEach(function (currentValue, index, array) {
                        createBindings(currentValue);
                    });
                    popContext();
                }
                break;
        }
    }

    function createBindingEval(code) {
        return new Function('$values', '\r\
            with ($values) {\r\
                return ({' + code + '});\r\
            }\r\
        ');
    };

    var nodeContexts = [];

    function getContext() {
        return nodeContexts[0];
    }

    function pushContext(node) {
        var context = {
            virtual: node.nodeType === Node.COMMENT_NODE,
            node: node,
            children: []
        };
        nodeContexts.unshift(context);
        return context;
    }

    function popContext() {
        return nodeContexts.shift();
    }

    Template.getContext = getContext;
    Template.pushContext = pushContext;
    Template.popContext = popContext;

    Template.parse = parse;
    Template.createBindingEval = createBindingEval;

    return Template;
})();
