import TestRunner from '../TestRunner';
import Cascade from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'Changes push after pull.',
    test: function(input, callback) {
        var runsAB = 0;
        var runsABC = 0;
        var model: any = {};
        Cascade.createObservable(model, 'a', 1);
        Cascade.createObservable(model, 'b', 2);
        Cascade.createObservable(model, 'c', 3);
        Cascade.createComputed(model, 'ab', function() {
            runsAB++;
            return model.a + model.b;
        });
        Cascade.createComputed(model, 'abc', function() {
            runsABC++;
            if (complete) {
                callback({
                    ab: ab,
                    runsAB: runsAB,
                    runsABC: runsABC
                });
            }
            return model.ab + model.c;
        });
        model.a = 11;
        var ab = model.ab;
        var complete = true;
    },
    assert: function(result, callback) {
        callback(result.ab == 13 && result.runsAB == 2 && result.runsABC == 2);
    }
});
