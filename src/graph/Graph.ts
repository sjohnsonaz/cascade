import Observable from './Observable';
import Computed from './Computed';

export default class Graph {
    observables: Object;

    constructor() {
        this.observables = {};
    }

    peekValue(obj, property) {
        return obj.observables[property].value;
    }

    dispose() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                this.observables[index].dispose();
            }
        }
    }

    disposeAll() {
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

    static disposeAll(obj) {
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
                    Graph.disposeAll(value);
                }
            }
        }
    }

    static attachGraph(obj) {
        if (!obj._graph) {
            Object.defineProperty(obj, '_graph', {
                configurable: true,
                writable: true,
                enumerable: false,
                value: new Graph()
            });
        }
    }

    static createProperty(obj, property, observable) {
        Graph.attachGraph(obj);
        if (obj._graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = obj._graph.observables[property].subscribers;
        }
        obj._graph.observables[property] = observable;
    }

    static createObservable(obj, property, value) {
        var observable = new Observable(value);
        Graph.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return observable.getValue();
            },
            set: function(value) {
                observable.setValue(value);
            }
        });
    }

    static createComputed(obj, property, definition) {
        var computed = new Computed(definition);
        Graph.createProperty(obj, property, computed);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return computed.getValue();
            }
        });
    }
}
