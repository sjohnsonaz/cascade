var Template = (function () {
    function Template() {

    }

    Template.prototype = {

    };

    Template.parse = function (text) {
        text = text.replace(/\{\{(.*)\}\}/g, function (match, value, offset, string) {
            return '<!-- ' + value.trim() + ' -->';
        });
        var template = document.createElement('template');
        template.innerHTML = text;
        var fragment = template.content;
        if (!fragment) {
            var fragment = document.createDocumentFragment();
            while (template.firstChild) {
                fragment.appendChild(template.firstChild);
            }
        }
        Template.createBindings(fragment);
        return fragment;
    };

    Template.createBindings = function (node) {
        if (node.attributes) {
            var dataBind = node.attributes['data-bind'];
            var dataHandler = node.attributes['data-handler'];
            if (dataBind || dataHandler) {
                node.removeAttribute('data-bind');
                node.removeAttribute('data-handler');
                node.binding = Template.createBindingEval(dataBind.value);
                node.handler = Template.handlers[dataHandler.value];
            }
        }

        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            Template.createBindings(child);
        }
    };

    Template.build = function (templateFragment, data) {
        var context = new Context(data);
        var fragment = Template.cloneNode(templateFragment, context);
        return fragment;
    };

    Template.cloneNode = function (node, context, callback) {
        var copy = node.cloneNode();
        if (node.binding) {
            bindNode(copy, binding, context, cloneNode);
        }
    };

    function cloneNode(node, context) {
        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            copy.appendChild(Template.cloneNode(child, context));
        }
        return copy;
    }

    function bindNode(node, binding, context) {
        var handlers = binding(context);
        var newContext;
        for (var name in handlers) {
            if (handlers.hasOwnProperty(name)) {
                var references = handlers[name];
                var handler = Template.handlers[name];
                if (!(references instanceof Array)) {
                    references = [references];
                }
                for (var index = 0, length = references.length; index < length; index++) {
                    var reference = references[index];
                    if (reference instanceof Context) {
                        references[index] = reference.$data;
                    }
                }
                (function () {
                    Module.bind({
                        update: function () {
                            newContext = handler(node, arguments, context, references) || newContext;
                            if (newContext instanceof Context) {
                                context = newContext;
                            }

                        }
                    }, references);
                })();
            }
        }
        return newContext || context;
    };

    Template.formatString = function (pattern, values) {
        if (typeof pattern === 'string') {
            if (!(values instanceof Array) && typeof values !== 'object') {
                values = Array.prototype.slice.call(arguments).splice(1, 1);
            }
            return pattern.replace(/\{\{|\}\}|\{(\d+)\}|\{(\w+):(.+)\}/g, function (match, valueIndex, helperName, argsText) {
                if (match == "{{") {
                    return "{";
                }
                if (match == "}}") {
                    return "}";
                }
                if (helperName) {
                    var helper = build.Module.helpers[helperName];
                    if (typeof helper === 'function') {
                        var argsIndexes = argsText.match(/\[(.*)\]|(\d+)|([A-Za-z_][A-Za-z0-9_]*)(.[A-Za-z_][A-Za-z0-9_]*)*/g);
                        var args = [];
                        for (var index = 0, length = argsIndexes.length; index < length; index++) {
                            var argIndex = argsIndexes[index];
                            if (argIndex[0] === '[') {
                                args[index] = argIndex.substring(1, argIndex.length - 1);
                            } else {
                                if (typeof argIndex === 'string') {
                                    args[index] = getValue(values, argIndex);
                                } else {
                                    args[index] = values[argIndex];
                                }
                            }
                        }
                        return helper.apply(this, args);
                    } else {
                        // Helper not found
                        return '';
                    }
                } else {
                    return values[valueIndex];
                }
            });
        } else {
            return pattern;
        }
    };
    Template.createBindingEval = function (code) {
        return new Function('values', '\r\
            with (values) {\r\
                with (values.$data.$module ? values.$data.$module.references : values.$data) {\r\
                    return ({' + code + '});\r\
                }\r\
            }\r\
        ');
    };
    Template.createEval = function (code) {
        return new Function('values', '\
            with (values) {\
                return (' + code + ');\
            }\
        ');
    };
    Template.createEvalStrict = function (code) {
        return new Function('values', '\
            with (values) {\
                return (function() {\
                    "use strict";\
                    return eval("' + code + '");\
                })();\
            }\
        ');
    };
    Template.handlers = {
        html: function (node, values, context) {
            node.innerHTML = values[0];
        },
        'with': function (node, values, context) {
            return values[0];
        }
    };

    return Template;
})();
