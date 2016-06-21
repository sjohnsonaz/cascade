import TestRunner from '../TestRunner';
import Cascade from '../../../src/modules/Cascade';

TestRunner.test({
    name: 'Changes result in minimal updates to mixed level Computed properties.',
    test: function(input, callback) {
        var viewModel: any = {};
        viewModel.runs = 0;
        Cascade.createObservable(viewModel, 'a', 1);
        Cascade.createObservable(viewModel, 'b', 2);
        Cascade.createObservable(viewModel, 'c', 3);
        Cascade.createComputed(viewModel, 'ab', function() {
            return viewModel.a + viewModel.b;
        });
        Cascade.createComputed(viewModel, 'bc', function() {
            return viewModel.b + viewModel.c;
        });
        Cascade.createComputed(viewModel, 'aab', function() {
            return viewModel.a + viewModel.ab;
        });
        var complete = false;
        viewModel._graph.observables.aab.subscribe(function(value) {
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
