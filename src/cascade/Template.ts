var nodeContexts: Array<any> = [];

export default class Template {
    fragment: DocumentFragment;
    constructor(text: string) {
        this.fragment = Template.parse(text);
    }

    build(data?: any) {
        var node = Template.renderNode(this.fragment, data || {}); //this.fragment.cloneNode(true);
        return node;
    }

    static renderNode(node, data) {
        var copy = node.cloneNode(false);
        if (node.binding) {
            var value = node.binding(data);
            if (value.if !== false) {
                if (node.nodeType === Node.COMMENT_NODE) {
                    var comment = copy;
                    copy = document.createDocumentFragment();
                    copy.appendChild(comment);
                    for (var index = 0, length = node.fragment.childNodes.length; index < length; index++) {
                        copy.appendChild(Template.renderNode(node.fragment.childNodes[index], data));
                    }
                } else {
                    if (value.html) {
                        copy.innerHTML = value.html;
                    } else {
                        for (var index = 0, length = node.childNodes.length; index < length; index++) {
                            copy.appendChild(Template.renderNode(node.childNodes[index], data));
                        }
                    }
                }
            }
        } else {
            for (var index = 0, length = node.childNodes.length; index < length; index++) {
                copy.appendChild(Template.renderNode(node.childNodes[index], data));
            }
        }
        return copy;
    }

    static parse(text) {
        text = Template.replaceControlStatements(text);
        var fragment = Template.createTemplateFragment(text);
        Template.createBindings(fragment);
        return fragment;
    }

    static replaceControlStatements(text) {
        return text.replace(/\@([^{]*)\{([^}]*)\}|\@([a-zA-Z0-9]*)/g, function(match, $1, $2, $3, offset, string) {
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

    static createTemplateFragment(text) {
        var template = document.createElement('template') as HTMLTemplateElement;
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

    static createBindings(node) {
        var context = Template.getContext();
        if (context) {
            context.children.push(node);
        }
        switch (node.nodeType) {
            case Node.COMMENT_NODE:
                var commentText = node.textContent.trim();
                var commentContext;
                if (commentText.startsWith('bind ')) {
                    commentContext = Template.pushContext(node);
                    node.context = commentContext;
                    node.binding = Template.createBindingEval(commentText.substring(5));
                } else if (commentText.startsWith('/bind')) {
                    commentContext = Template.popContext();
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
                    Template.pushContext(node);
                    Array.prototype.slice.call(node.childNodes).forEach(function(currentValue, index, array) {
                        Template.createBindings(currentValue);
                    });
                    Template.popContext();
                }
                break;
            default:
                var dataBind;
                if (node.attributes) {
                    dataBind = node.attributes['data-bind'];
                    if (dataBind) {
                        node.removeAttribute('data-bind');
                        node.binding = Template.createBindingEval(dataBind.value);
                    }
                }
                if (node.childNodes.length) {
                    Template.pushContext(node);
                    Array.prototype.slice.call(node.childNodes).forEach(function(currentValue, index, array) {
                        Template.createBindings(currentValue);
                    });
                    Template.popContext();
                }
                break;
        }
    }

    static createBindingEval(code) {
        return new Function('$values', '\r\
            with ($values) {\r\
                return ({' + code + '});\r\
            }\r\
        ');
    };

    static getContext() {
        return nodeContexts[0];
    }

    static pushContext(node) {
        var context = {
            virtual: node.nodeType === Node.COMMENT_NODE,
            node: node,
            children: []
        };
        nodeContexts.unshift(context);
        return context;
    }

    static popContext() {
        return nodeContexts.shift();
    }
}
