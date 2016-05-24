var Graph = (function () {
    function Graph() {
        this.subscribables = {};
    }

    Graph.prototype = {
        peekValue: function (obj, property) {
            return obj.subscribables[property].value;
        }
    };

    function attachGraph(obj) {
        if (!obj._graph) {
            Object.defineProperty(obj, '_graph', {
                configurable: true,
                writable: true,
                enumerable: false,
                value: new Graph()
            });
        }
    }

    function createProperty(obj, property, subscribable) {
        attachGraph(obj);
        if (obj._graph.subscribables[property]) {
            // TODO: move or delete subscriptions?
            subscribable.subscribers = obj._graph.subscribables[property].subscribers;
        }
        obj._graph.subscribables[property] = subscribable;
    }

    function createObservable(obj, property, value) {
        var observable = new Observable(value);
        createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function () {
                return observable.getValue();
            },
            set: function (value) {
                observable.setValue(value);
            }
        });
    }

    function createComputed(obj, property, definition) {
        var computed = new Computed(definition);
        createProperty(obj, property, computed);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function () {
                return computed.getValue();
            }
        });
    }

    Graph.createObservable = createObservable;
    Graph.createComputed = createComputed;

    return Graph;
})();
