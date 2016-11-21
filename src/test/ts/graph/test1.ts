import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable a: number = 1;
    @observable b: number = 2;
    @observable c: number = 3;
    @observable get ab() {
        return this.a + this.b;
    }
    @observable get bc() {
        return this.b + this.c;
    }
    @observable get aab() {
        return this.a + this.ab;
    }
}

TestRunner.test({
    name: 'Changes result in minimal updates to mixed level Computed props.',
    test: function(input, callback) {
        var viewModel: any = new ViewModel();
        var complete = false;
        viewModel._graph.subscribe('aab', function(value) {
            viewModel.runs++;
            if (complete) {
                callback({
                    value: value,
                    runs: viewModel.runs
                });
            }
        });
        viewModel.a = 11;
        complete = true;
    },
    assert: function(result, callback) {
        if (result.value == 24 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
