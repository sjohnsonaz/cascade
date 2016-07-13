import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs = 0;
    @observable a = 1;
    @observable b = 2;
    @observable get ab() {
        this.runs++;
        return this.a + this.b;
    }
}

TestRunner.test({
    name: 'Changes can be pulled.',
    test: function(input, callback) {
        var model: any = new ViewModel();
        model.a = 11;
        callback({
            ab: model.ab,
            runs: model.runs
        });
    },
    assert: function(result, callback) {
        callback(result.ab == 13 && result.runs == 1);
    }
});
