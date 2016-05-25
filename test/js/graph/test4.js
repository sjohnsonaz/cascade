TestRunner.test({
    name: 'test 4',
    test: function (input, callback) {
        var viewModel = {};
        viewModel.runs = 0;
        Graph.createObservable(viewModel, 'a', 1);
        Graph.createObservable(viewModel, 'b', 2);
        Graph.createComputed(viewModel, 'ab', function () {
            viewModel.runs++;
            return viewModel.a + viewModel.b;
        });
        viewModel.a = 11;
        callback(viewModel);
    },
    assert: function (result, callback) {
        if (result.ab == 13 && result.runs == 2) {
            callback(true);
        } else {
            callback(false);
        }
    }
});
