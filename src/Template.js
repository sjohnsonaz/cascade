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
            if (dataBind) {
                var func = Template.createEval(dataBind.value);
                node.binding = func;
            }
        }

        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            Template.createBindings(child);
        }
    };

    Template.build = function (templateFragment, context) {
        var fragment = Template.cloneNode(templateFragment, context);
        return fragment;
    };

    Template.cloneNode = function (node, context) {
        var copy = node.cloneNode();
        Template.bindNode(copy, node, context);
        var children = node.childNodes;
        for (var index = 0, length = children.length; index < length; index++) {
            var child = children[index];
            copy.appendChild(Template.cloneNode(child, context));
        }
        return copy;
    };

    Template.bindNode = function (copy, node, context) {
        if (node.binding) {
            var func = node.binding;
            copy.innerHTML = func(context);
        }
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

    return Template;
})();
