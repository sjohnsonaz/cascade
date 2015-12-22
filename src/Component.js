var Component = (function () {
    function Component(dom) {
        this.managedChildren = [];
        var domRenderer = new DomRenderer(this);
        Object.defineProperty(this, 'element', {
            value: (dom || domRenderer).createElement(this.elementType || this.constructor.name)
        });
        this.run = function (data) {
            this.render(domRenderer, this.element, this);
        };
    }

    function create(constructorFunction) {
        return function () {
            var result = Object.create(constructorFunction.prototype, Build.debug ? {
                constructor: {
                    value: constructorFunction
                }
            } : undefined);
            result = constructorFunction.apply(result, arguments) || result;
            context.managedChildren.push(result);
            return result;
        };
    }

    function createChild(constructorFunction, context) {
        return function () {
            var result = Object.create(constructorFunction.prototype, Build.debug ? {
                constructor: {
                    value: constructorFunction
                }
            } : undefined);
            result = constructorFunction.apply(result, arguments) || result;
            context.managedChildren.push(result);
            return result;
        };
    }

    Component.prototype = {
        //elementType: 'div',
        render: function (dom, element, data) {},
        createChild: function (context) {
            var self = this;
            return function () {
                var result = Object.create(self.prototype, Build.debug ? {
                    constructor: {
                        value: self
                    }
                } : undefined);
                result = self.apply(result, arguments) || result;
                context.managedChildren.push(result);
                return result;
            };
        },
        destroy: function () {
            //var child =
        }
    };

    return Component;
})();
