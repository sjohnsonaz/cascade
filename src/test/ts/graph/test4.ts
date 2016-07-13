import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsAB = 0;
    runsABC = 0;
    @observable a = 1;
    @observable b = 2;
    @observable c = 3;
    @observable get ab() {
        this.runsAB++;
        return this.a + this.b;
    }
    @observable get abc() {
        this.runsABC++;
        return this.ab + this.c;
    }
}

TestRunner.test({
    name: 'Changes push after pull.',
    test: function(input, callback) {
        var model: any = new ViewModel();
        model._graph.subscribe('abc', function(value) {
            if (complete) {
                callback({
                    ab: ab,
                    runsAB: model.runsAB,
                    runsABC: model.runsABC
                });
            }
        });
        var complete = false
        model.a = 11;
        var ab = model.ab;
        var complete = true;
    },
    assert: function(result, callback) {
        callback(result.ab == 13 && result.runsAB == 2 && result.runsABC == 2);
    }
});
