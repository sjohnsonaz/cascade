var Context = (function () {
    function Context(data, root, parent, depth, index) {
        this.$data = data
        this.$root = root || parent || this; // Context
        this.$parent = parent; // Context
        this.$depth = depth || 0;
        this.$index = index || 0;
        this.$children = {}; // Contexts
    }

    Context.prototype = {
        $parents: function (parentIndex) {
            var parent = this.$parent;
            for (var index = 0; index < parentIndex; index++) {
                if (parent) {
                    parent = parent.$parent;
                } else {
                    parent = undefined;
                    break;
                }
            }
            return parent;
        }
    };

    Context.child = function (value, current) {
        if (current) {
            return new Context(value, current.$root, current);
        } else {
            return new Context(value);
        }
    }

    return Context;
})();
