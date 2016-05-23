var Graph = (function () {
    function Graph() {
        this.subscribables = {};
    }

    Graph.prototype = {
        peekValue: function (obj, property) {
            return obj.subscribables[property].value;
        }
    };

    Graph.computedContexts = [];

    function getContext() {
        return Graph.computedContexts[Graph.computedContexts.length - 1];
    }

    function pushContext() {
        var context = new ComputedContext();
        Graph.computedContexts.push(context);
        return context;
    }

    function popContext() {
        return Graph.computedContexts.pop();
    }

    function attachGraph(obj) {
        if (!obj._graph) {
            obj._graph = new Graph();
        }
    }

    function createProperty(obj, property, subscribable) {
        attachGraph(obj);
        if (obj._graph.subscribables[property]) {
            // delete subscriptions
        }
        obj._graph.subscribables[property] = subscribable;
    }

    function createObservable(obj, property, value) {
        var observable = new Observable(value);
        createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
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
            get: function () {
                return computed.getValue();
            }
        });
    }

    Graph.createObservable = createObservable;
    Graph.createComputed = createComputed;
    Graph.getContext = getContext;
    Graph.pushContext = pushContext;
    Graph.popContext = popContext;

    return Graph;
})();
