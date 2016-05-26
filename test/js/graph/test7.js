TestRunner.test({
    name: 'Changes can be pulled to multiple layers.',
    test: function (input, callback) {
        var runsAB = 0;
        var runsC = 0;
        var model = {};
        Graph.createObservable(model, 'a', 1);
        Graph.createObservable(model, 'b', 2);
        Graph.createComputed(model, 'ab', function () {
            runsAB++;
            return model.a + model.b;
        });
        Graph.createComputed(model, 'c', function () {
            runsC++;
            return model.ab;
        });
        model.a = 11;
        var c = model.c;
        callback({
            c: c,
            runsAB: runsAB,
            runsC: runsC
        });
    },
    assert: function (result, callback) {
        callback(result.c == 13 && result.runsAB == 2 && result.runsC == 2);
    }
});
