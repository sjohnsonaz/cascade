TestRunner.test({
    name: 'Changes result in minimal updates to mixed level Computed properties.',
    test: function (input, callback) {
        var viewModel = {};
        viewModel.runs = 0;
        Graph.createObservable(viewModel, 'a', 1);
        Graph.createObservable(viewModel, 'b', 2);
        Graph.createObservable(viewModel, 'c', 3);
        Graph.createComputed(viewModel, 'ab', function () {
            return viewModel.a + viewModel.b;
        });
        Graph.createComputed(viewModel, 'bc', function () {
            return viewModel.b + viewModel.c;
        });
        Graph.createComputed(viewModel, 'aab', function () {
            return viewModel.a + viewModel.ab;
        });
        var complete = false;
        viewModel._graph.observables.aab.subscribe(function (value) {
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
    assert: function (result, callback) {
        if (result.value == 24 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
