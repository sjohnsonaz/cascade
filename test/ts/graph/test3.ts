import TestRunner from '../TestRunner';
import Cascade from '../../../src/modules/Cascade';

TestRunner.test({
    name: 'Changes can be pulled.',
    test: function(input, callback) {
        var runs = 0;
        var model: any = {};
        Cascade.createObservable(model, 'a', 1);
        Cascade.createObservable(model, 'b', 2);
        Cascade.createComputed(model, 'ab', function() {
            runs++;
            return model.a + model.b;
        });
        model.a = 11;
        callback({
            ab: model.ab,
            runs: runs
        });
    },
    assert: function(result, callback) {
        callback(result.ab == 13 && result.runs == 2);
    }
});
