window.onload = function () {
    window.viewModel = new function () {
        var self = this;
        Graph.createObservable(this, 'a', 1);
        Graph.createObservable(this, 'b', 2);
        Graph.createComputed(this, 'computed', function () {
            return self.a + self.b;
        });
    }
};
