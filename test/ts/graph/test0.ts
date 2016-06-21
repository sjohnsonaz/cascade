import TestRunner from '../TestRunner';
import Cascade from '../../../src/modules/Cascade';

TestRunner.test({
    name: 'Changes result in minimal updates.',
    test: function(input, callback) {
        var viewModel: any = {};
        viewModel.runs = 0;
        Cascade.createObservable(viewModel, 'a', 1);
        Cascade.createObservable(viewModel, 'b', 2);
        Cascade.createObservable(viewModel, 'c', 3);
        Cascade.createObservable(viewModel, 'd', 4);
        Cascade.createComputed(viewModel, 'ab', function() {
            return viewModel.a + viewModel.b;
        });
        Cascade.createComputed(viewModel, 'ac', function() {
            return viewModel.a + viewModel.c;
        });
        Cascade.createComputed(viewModel, 'ad', function() {
            return viewModel.a + viewModel.d;
        });
        Cascade.createComputed(viewModel, 'bc', function() {
            return viewModel.b + viewModel.c;
        });
        Cascade.createComputed(viewModel, 'bd', function() {
            return viewModel.b + viewModel.d;
        });
        Cascade.createComputed(viewModel, 'cd', function() {
            return viewModel.c + viewModel.d;
        });
        Cascade.createComputed(viewModel, 'abcd', function() {
            return viewModel.ab + viewModel.ac + viewModel.ad + viewModel.bc + viewModel.bd + viewModel.cd;
        });
        var complete = false;
        viewModel._graph.observables.abcd.subscribe(function(value) {
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
