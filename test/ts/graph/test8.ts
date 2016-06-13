import TestRunner from '../TestRunner';
import Graph from '../../../src/graph/Graph';

TestRunner.test({
    name: 'Changes can be pulled to multiple layers - lower first.',
    test: function(input, callback) {
        var runsB = 0;
        var runsC = 0;
        var runsD = 0;
        var model: any = {};
        Graph.createObservable(model, 'a', 1);
        Graph.createComputed(model, 'b', function() {
            runsB++;
            return model.a;
        });
        Graph.createComputed(model, 'c', function() {
            runsC++;
            return model.b;
        });
        Graph.createComputed(model, 'd', function() {
            runsD++;
            return model.c;
        });
        model.a = 11;
        callback({
            b: model.b,
            c: model.c,
            runsB: runsB,
            runsC: runsC,
            runsD: runsD
        });
    },
    assert: function(result, callback) {
        callback(
            result.b == 11 &&
            result.c == 11 &&
            result.runsB == 2 &&
            result.runsC == 2 &&
            result.runsD == 1
        );
    }
});
