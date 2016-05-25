TestRunner.test({
    name: 'test 2',
    test: function (input, callback) {
        var viewModel = {};
        viewModel.runs = 0;
        Graph.createObservable(viewModel, 'a', [1, 2, 3]);
        Graph.createComputed(viewModel, 'loop', function () {
            var a = viewModel.a;
            var total = 0;
            for (var index = 0, length = a.length; index < length; index++) {
                total += a[index];
            }
            return total;
        });
        var complete = false;
        viewModel._graph.observables.loop.subscribe(function (value) {
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
    assert: function (result, callback) {
        if (result.value == 10 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
