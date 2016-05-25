window.onload = function () {
    console.time('tests');
    runAllTests([test0, test1, test2], function (output) {
        window.tests = output;
        console.timeEnd('tests');
    })
};

function runAllTests(tests, callback) {
    var index = 0;
    var output = [];
    runTest(tests, index, function iterate(data) {
        output.push(data);
        index++;
        if (index < tests.length) {
            runTest(tests, index, iterate);
        } else {
            callback(output);
        }
    });
}

function runTest(tests, index, callback) {
    tests[index](callback);
}

function test0(callback) {
    console.log('test 0');
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
            console.log('Value: ' + value + ', Runs: ' + viewModel.runs);
            callback(viewModel);
        }
    });
    viewModel.a = 11;
    viewModel.b = 12;
    viewModel.c = 13;
    viewModel.d = 14;
    complete = true;
}

function test1(callback) {
    console.log('test 1');
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
            console.log('Value: ' + value + ', Runs: ' + viewModel.runs);
            callback(viewModel);
        }
    });
    viewModel.a = 11;
    complete = true;
}

function test2(callback) {
    console.log('test 2');
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
            console.log('Value: ' + value + ', Runs: ' + viewModel.runs);
            callback(viewModel);
        }
    });
    viewModel.a = [1, 2, 3, 4];
    complete = true;
}
