import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsB = 0;
    runsC = 0;
    runsD = 0;
    runsE = 0;
    @observable a = 1;
    @observable get b() {
        this.runsB++;
        return this.a;
    }
    @observable get c() {
        this.runsC++;
        return this.b;
    }
    @observable get d() {
        this.runsD++;
        return this.c;
    }
    @observable get e() {
        this.runsE++;
        return this.d;
    }
}

TestRunner.test({
    name: 'Changes can be pulled to deep layers.',
    test: function(input, callback) {
        var model: any = new ViewModel();
        model._graph.subscribe('e', function(value) {
            if (result) {
                result.finalE = value;
                result.finalRunsE = model.runsE
                callback(result);
            }
        });
        model.a = 11;
        var d = model.d;
        var result: any = {
            a: model._graph.observables.a.value,
            b: model._graph.observables.b.value,
            c: model._graph.observables.c.value,
            d: d,
            e: model._graph.observables.e.value,
            runsB: model.runsB,
            runsC: model.runsC,
            runsD: model.runsD,
            runsE: model.runsE
        };
    },
    assert: function(result, callback) {
        callback(
            result.a == 11 &&
            result.b == 11 &&
            result.c == 11 &&
            result.d == 11 &&
            result.e == 1 &&
            result.finalE == 11 &&
            result.runsB == 2 &&
            result.runsC == 2 &&
            result.runsD == 2 &&
            result.runsE == 1 &&
            result.finalRunsE == 2
        );
    }
});
