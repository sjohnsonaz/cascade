var Graph = (function () {
    function Graph() {

    }

    Graph.prototype = {

    };

    Graph.computedContexts = [];

    Graph.observable = function (value) {
        var context = Graph.computedContexts[Graph.computedContexts.length - 1];
        context.references.push(this); // TODO: confirm this
    };

    Graph.computed = function (definition) {

    };

    return Graph;
})();

var Subscribable = (function () {
    function Subscribable(value) {
        this.value = value;
        this.subscribers = [];
    }

    Subscribable.prototype = {
        subscribe: function (callback) {
            if (callback) {
                this.subscribers.push(callback);
                callback(this.value);
            }
        },
        unsubscribe: function (callback) {
            if (callback) {
                var index = this.subscribers.indexOf(callback);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            }
        },
        publish: function () {
            for (var index = 0, length = this.subscribers.length; index < length; index++) {
                var subscriber = this.subscribers[index];
                subscriber(this.value);
            }
        }
    };

    return Subscribable;
})();

var Observable = (function () {
    function Observable() {
        Define.super(Subscribable, this);
    }

    Define.extend(Observable, Subscribable, {
        getValue: function () {
            var context = Graph.computedContexts[Graph.computedContexts.length - 1];
            if (context) {
                context.references.push(this);
            }
            return this.value;
        },
        setValue: function (value) {
            this.value = value;
            this.publish();
        }
    });

    return Observable;
})();

var Computed = (function () {
    function Computed(definition) {
        Define.super(Subscribable, this);

        this.subscriptions = [];
        this.definition = definition;
        this.runDefinition(definition);

        return this.value;
    }

    Define.extend(Computed, Subscribable, {
        runDefinition: function (definition) {
            for (var index = 0, length = this.subscriptions.length; index < length; index++) {
                var subscription = this.subscriptions[index];
            }

            var context = new ComputedContext();
            Graph.computedContexts.push(context);
            this.value = definition();
            Graph.computedContexts.pop();

            for (var index = 0, length = context.references.length; index < length; index++) {
                var reference = context.references[index];
            }
        }
    });

    return Computed;
})();

var ComputedContext = (function () {
    function ComputedContext() {
        this.references = [];
    }

    ComputedContext.prototype = {

    };

    return ComputedContext;
})();
