var Graph = (function () {
    function Graph() {
        this.observables = {};
    }

    Graph.prototype = {
        peekValue: function (obj, property) {
            return obj.observables[property].value;
        },
        dispose: function () {
            for (var index in this.observables) {
                if (this.observables.hasOwnProperty(index)) {
                    this.observables[index].dispose();
                }
            }
        },
        disposeAll: function () {
            for (var index in this.observables) {
                if (this.observables.hasOwnProperty(index)) {
                    var observable = this.observables[index];
                    if (observable.value && observable.value._graph) {
                        observable.value._graph.disposeAll();
                    }
                    observable.dispose();
                }
            }
        }
    };

    function disposeAll(obj) {
        var graph = obj._graph;
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                if (graph && graph.observables[index]) {
                    var observable = graph.observables[index];
                    var value = observable.value;
                    observable.dispose();
                } else {
                    var value = obj[index];
                }
                if (value) {
                    disposeAll(value);
                }
            }
        }
    }

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

    Graph.disposeAll = disposeAll;
    Graph.createObservable = createObservable;
    Graph.createComputed = createComputed;

    return Graph;
})();
