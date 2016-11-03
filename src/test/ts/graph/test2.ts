import TestRunner from '../TestRunner';
import {observable, array} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable a: number[] = [1, 2, 3];
    @observable get loop() {
        var a = this.a;
        var total = 0;
        for (var index = 0, length = a.length; index < length; index++) {
            total += a[index];
        }
        return total;
    }
}

TestRunner.test({
    name: 'Changes to Arrays are observed.',
    test: function(input, callback) {
        var viewModel: any = new ViewModel();
        var complete = false;
        viewModel._graph.subscribe('loop', function(value) {
            viewModel.runs++;
            if (complete) {
                callback({
                    value: value,
                    runs: viewModel.runs
                });
            }
        });
        viewModel.a = [1, 2, 3, 4];
        viewModel.a.push(10);
        viewModel.a.push(100);
        complete = true;
    },
    assert: function(result, callback) {
        if (result.value == 120 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
