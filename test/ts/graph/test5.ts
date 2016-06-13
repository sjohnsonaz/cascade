import TestRunner from '../TestRunner';
import Graph from '../../../src/graph/Graph';

TestRunner.test({
    name: 'Observables may be disposed.',
    test: function(input, callback) {
        var runs = 0;
        var model: any = {};
        Graph.createObservable(model, 'a', 1);
        Graph.createObservable(model, 'b', 2);
        Graph.createComputed(model, 'ab', function() {
            runs++;
            return model.a + model.b;
        });
        model._graph.dispose();
        callback({
            a: model._graph.observables.a.subscribers.length,
            b: model._graph.observables.b.subscribers.length,
            runs: runs,
        });
    },
    assert: function(result, callback) {
        callback(result.a == 0 && result.b == 0 && result.runs == 1);
    }
});
