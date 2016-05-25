TestRunner.test({
    name: 'test 0',
    test: function (input, callback) {
        var viewModel = {};
        viewModel.runs = 0;
        Graph.createObservable(viewModel, 'a', 1);
        Graph.createObservable(viewModel, 'b', 2);
        Graph.createObservable(viewModel, 'c', 3);
        Graph.createObservable(viewModel, 'd', 4);
        Graph.createComputed(viewModel, 'ab', function () {
            return viewModel.a + viewModel.b;
        });
        Graph.createComputed(viewModel, 'ac', function () {
            return viewModel.a + viewModel.c;
        });
        Graph.createComputed(viewModel, 'ad', function () {
            return viewModel.a + viewModel.d;
        });
        Graph.createComputed(viewModel, 'bc', function () {
            return viewModel.b + viewModel.c;
        });
        Graph.createComputed(viewModel, 'bd', function () {
            return viewModel.b + viewModel.d;
        });
        Graph.createComputed(viewModel, 'cd', function () {
            return viewModel.c + viewModel.d;
        });
        Graph.createComputed(viewModel, 'abcd', function () {
            return viewModel.ab + viewModel.ac + viewModel.ad + viewModel.bc + viewModel.bd + viewModel.cd;
        });
        var complete = false;
        viewModel._graph.observables.abcd.subscribe(function (value) {
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
    assert: function (result, callback) {
        if (result.value == 150 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
