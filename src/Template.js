var Template = (function () {
    function Template() {

    }

    Template.prototype = {

    };

    /**
     * public
     */
    function parse(text) {
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
        createBindings(fragment);
        return fragment;
    }

    function createBindings(node) {
        if (node.attributes) {
            var dataBind = node.attributes['data-bind'];
            if (dataBind) {
                node.removeAttribute('data-bind');
                node.binding = Template.createBindingEval(dataBind.value);
            }
        }

        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            createBindings(child);
        }
    }

    /**
     * public
     */
    function build(templateFragment, data) {
        var context = new Context(data);
        var fragment = cloneNode(templateFragment, context);
        return fragment;
    }

    function cloneNode(node, context, callback) {
        var copy = node.cloneNode();
        if (node.binding) {
            var newContext = bindNode(copy, node.binding, context, cloneNode);
            if (newContext instanceof Context) {
                context = newContext;
            }
        }
        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            copy.appendChild(cloneNode(child, context));
        }
        return copy;
    };

    function bindNode(node, binding, context, callback) {
        var handlers = binding(context);
        var newContext;
        for (var name in handlers) {
            if (handlers.hasOwnProperty(name)) {
                var references = handlers[name];
                var handler = Template.handlers[name];
                if (!(references instanceof Array)) {
                    references = [references];
                }
                var values = [];
                for (var index = 0, length = references.length; index < length; index++) {
                    var reference = references[index];
                    if (reference instanceof Reference) {
                        values[index] = reference.value;
                    } else {
                        values[index] = reference;
                    }
                    //if (reference instanceof Context) {
                    //references[index] = reference.$data;
                    //}
                }
                //(function () {
                //Module.bind({
                //update: function () {
                //newContext = handler(node, arguments, context, references) || newContext;
                newContext = handler(node, values, context, references) || newContext;
                //}
                //}, references);
                //})();
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
                with (values.$data) {\
                    if (values.$data.$module) {\
                        with (values.$data.$module.references) {\r\
                            return ({' + code + '});\r\
                        }\r\
                    } else {\
                        return ({' + code + '});\r\
                    }\
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
    Template.parse = parse;
    Template.build = build;
    Template.handlers = {
        html: function (node, values, context) {
            node.innerHTML = values[0];
        },
        'with': function (node, values, context, references) {
            return Context.createContext(values[0], context);
        }
    };

    return Template;
})();
