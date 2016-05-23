var Computed = (function () {
    function Computed(definition) {
        Define.super(Subscribable, this);

        this.subscriptions = [];
        this.definition = definition;
        this.runDefinition(definition);

        return this.value;
    }

    Define.extend(Computed, Subscribable, {
        getValue: function () {
            var context = Graph.getContext();
            if (context) {
                context.references.push(this);
            }
            return this.value;
        },
        runDefinition: function (definition) {
            for (var index = 0, length = this.subscriptions.length; index < length; index++) {
                var subscription = this.subscriptions[index];
            }

            var context = Graph.pushContext();
            this.value = definition();
            Graph.popContext();

            for (var index = 0, length = context.references.length; index < length; index++) {
                var reference = context.references[index];
            }
        }
    });

    return Computed;
})();
