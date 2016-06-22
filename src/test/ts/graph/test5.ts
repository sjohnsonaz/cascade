import TestRunner from '../TestRunner';
import Cascade from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'Observables may be disposed.',
    test: function(input, callback) {
        var runs = 0;
        var model: any = {};
        Cascade.createObservable(model, 'a', 1);
        Cascade.createObservable(model, 'b', 2);
        Cascade.createComputed(model, 'ab', function() {
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
