var Graph = (function () {
    function Graph() {
        this.observables = {};
    }

    Graph.prototype = {
        peekValue: function (obj, property) {
            return obj.observables[property].value;
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

    function createProperty(obj, property, observable) {
        attachGraph(obj);
        if (obj._graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = obj._graph.observables[property].subscribers;
        }
        obj._graph.observables[property] = observable;
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
