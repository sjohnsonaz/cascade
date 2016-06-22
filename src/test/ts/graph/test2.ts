import TestRunner from '../TestRunner';
import Cascade from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'Changes to Arrays are observed.',
    test: function(input, callback) {
        var viewModel: any = {};
        viewModel.runs = 0;
        Cascade.createObservable(viewModel, 'a', [1, 2, 3]);
        Cascade.createComputed(viewModel, 'loop', function() {
            var a = viewModel.a;
            var total = 0;
            for (var index = 0, length = a.length; index < length; index++) {
                total += a[index];
            }
            return total;
        });
        var complete = false;
        viewModel._graph.observables.loop.subscribe(function(value) {
            viewModel.runs++;
            if (complete) {
                callback({
                    value: value,
                    runs: viewModel.runs
                });
            }
        });
        viewModel.a = [1, 2, 3, 4];
        complete = true;
    },
    assert: function(result, callback) {
        if (result.value == 10 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
