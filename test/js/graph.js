window.onload = function () {
    window.viewModel = new function () {
        var self = this;
        Graph.createObservable(this, 'test', 1);
        Graph.createComputed(this, 'computed', function () {
            return self.test;
        });
    }
};
