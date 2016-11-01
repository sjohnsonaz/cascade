declare var window: any;
import TestRunner from '../TestRunner';
import {observable, array} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @array a = [1, 2, 3];
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
        window.viewModel = viewModel;
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
        viewModel.a.push(4);
        complete = true;
    },
    assert: function(result, callback) {
        console.log(result);
        if (result.value == 10 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
