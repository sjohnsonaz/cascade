var Computed = (function () {
    function Computed(definition) {
        Define.super(Subscribable, this);

        this.references = [];
        this.definition = definition;
        this.runDefinition(definition);

        return this.value;
    }

    Define.extend(Computed, Subscribable, {
        notify: function () {
            var value = this.value;
            this.runDefinition(this.definition);
            if (this.value !== value) {
                this.publish();
            }
        },
        runDefinition: function (definition) {
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.unsubscribe(this);
            }

            var context = Graph.pushContext();
            this.value = definition();
            Graph.popContext();

            for (var index = 0, length = context.references.length; index < length; index++) {
                var reference = context.references[index];
                reference.subscribeOnly(this);
            }
        }
    });

    return Computed;
})();
