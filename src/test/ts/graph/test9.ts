import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsB = 0;
    runsC = 0;
    runsD = 0;
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
}

TestRunner.test({
    name: 'Changes can be pulled to multiple layers - higher first.',
    test: function(input, callback) {
        var model: any = new ViewModel();
        model.a = 11;
        var c = model.c;
        var b = model.b;
        callback({
            b: b,
            c: c,
            runsB: model.runsB,
            runsC: model.runsC,
            runsD: model.runsD
        });
    },
    assert: function(result, callback) {
        callback(
            result.b == 11 &&
            result.c == 11 &&
            result.runsB == 1 &&
            result.runsC == 1 &&
            result.runsD == 0
        );
    }
});
