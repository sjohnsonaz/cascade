window.onload = function () {
    window.viewModel = new function () {
        var self = this;
        Graph.createObservable(this, 'a', 1);
        Graph.createObservable(this, 'b', 2);
        Graph.createObservable(this, 'c', 3);
        Graph.createComputed(this, 'ab', function () {
            return self.a + self.b;
        });
        Graph.createComputed(this, 'bc', function () {
            return self.b + self.c;
        });
        Graph.createComputed(this, 'cd', function () {
            return self.c + self.d;
        });
        Graph.createComputed(this, 'ad', function () {
            return self.a + self.d;
        });
        Graph.createComputed(this, 'abc', function () {
            return self.ab + self.bc + self.cd + self.ad;
        });
        var runs = 0;
        this._graph.subscribables.abc.subscribe(function (value) {
            runs++;
        });
        this.a = 11;
        this.b = 12;
        this.c = 13;
        console.log(runs);
    }
};
