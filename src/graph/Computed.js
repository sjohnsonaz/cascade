var Computed = (function () {
    var id = 0;

    var computedQueue = new ComputedQueue();

    function Computed(definition) {
        Define.super(Subscribable, this);
        this.id = id;
        id++;

        this.references = [];
        this.definition = definition;
        this.runDefinition(definition);

        return this.value;
    }

    Define.extend(Computed, Subscribable, {
        notify: function () {
            if (computedQueue.completed) {
                computedQueue = new ComputedQueue();
            }
            computedQueue.add(this);
        },
        runUpdate: function () {
            var value = this.value;
            this.runDefinition(this.definition);
            if (this.value !== value) {
                this.publish();
            }
        },
        runDefinition: function (definition) {
            //TODO: Reduce unsubscribe calls.
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.unsubscribe(this);
            }

            Subscribable.pushContext();
            this.value = definition();
            var context = Subscribable.popContext();

            //TODO: Prevent redundant subscription.
            for (var index = 0, length = context.length; index < length; index++) {
                var reference = context[index];
                reference.subscribeOnly(this);
            }
        }
    });

    return Computed;
})();
