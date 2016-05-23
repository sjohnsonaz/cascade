window.onload = function () {
    window.viewModel = new function () {
        var self = this;
        this.runs = 0;
        Graph.createObservable(this, 'a', 1);
        Graph.createObservable(this, 'b', 2);
        Graph.createObservable(this, 'c', 3);
        Graph.createObservable(this, 'd', 4);
        Graph.createComputed(this, 'ab', function () {
            return self.a + self.b;
        });
        Graph.createComputed(this, 'ac', function () {
            return self.a + self.c;
        });
        Graph.createComputed(this, 'ad', function () {
            return self.a + self.d;
        });
        Graph.createComputed(this, 'bc', function () {
            return self.b + self.c;
        });
        Graph.createComputed(this, 'bd', function () {
            return self.b + self.d;
        });
        Graph.createComputed(this, 'cd', function () {
            return self.c + self.d;
        });
        Graph.createComputed(this, 'abcd', function () {
            return self.ab + self.ac + self.ad + self.bc + self.bd + self.cd;
        });
        this._graph.subscribables.abcd.subscribe(function (value) {
            self.runs++;
            console.log('Value: ' + value + ', Runs: ' + self.runs);
        });
        this.a = 11;
        this.b = 12;
        this.c = 13;
        this.d = 14;
    }
};
