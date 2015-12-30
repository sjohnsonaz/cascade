var Context = (function () {
    function Context(data, root, parent, index) {
        this.$data = data
        this.$root = root || parent || this; // Context
        this.$parent = parent; // Context
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
        },
        $child: function (name) {
            if (!this.$children[name]) {
                this.$children[name] = new Context(this.$data[name], this.$root, this);
            }
            return this.$children[name];
        }
    };

    return Context;
})();
