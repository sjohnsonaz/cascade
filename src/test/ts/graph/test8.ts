import TestRunner from '../TestRunner';
import Cascade from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'Changes can be pulled to multiple layers - lower first.',
    test: function(input, callback) {
        var runsB = 0;
        var runsC = 0;
        var runsD = 0;
        var model: any = {};
        Cascade.createObservable(model, 'a', 1);
        Cascade.createComputed(model, 'b', function() {
            runsB++;
            return model.a;
        });
        Cascade.createComputed(model, 'c', function() {
            runsC++;
            return model.b;
        });
        Cascade.createComputed(model, 'd', function() {
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
