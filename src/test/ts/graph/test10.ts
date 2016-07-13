declare var window: any;
import TestRunner from '../TestRunner';
import Cascade, {observable, computed} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable a = 1;
    @observable b: number = 2
    @observable c: number = 3
    @observable d: number = 4
    @computed() get ab() {
        return this.a + this.b;
    }
    @computed() get ac(): number {
        return this.a + this.c;
    }
    @computed() get ad(): number {
        return this.a + this.d;
    }
    @computed() get bc(): number {
        return this.b + this.c;
    }
    @computed() get bd(): number {
        return this.b + this.d;
    }
    @computed() get cd(): number {
        return this.c + this.d;
    }
    @computed() get abcd(): number {
        return this.ab + this.ac + this.ad + this.bc + this.bd + this.cd;
    }
}

TestRunner.test({
    name: 'Changes result in minimal updates.',
    test: function(input, callback) {
        var viewModel: any = new ViewModel();
        window.viewModel = viewModel;
        var complete = false;
        viewModel._graph.subscribe('abcd', function(value) {
            viewModel.runs++;
            if (complete) {
                callback({
                    value: value,
                    runs: viewModel.runs
                });
            }
        });
        viewModel.a = 11;
        viewModel.b = 12;
        viewModel.c = 13;
        viewModel.d = 14;
        complete = true;
    },
    assert: function(result, callback) {
        if (result.value == 150 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
