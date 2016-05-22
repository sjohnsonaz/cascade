window.onload = function() {
    window.viewModel = new function() {
        var self = this;
        this.test = new Observable(1);
        this.computed = new Computed(function() {
            return self.test.getValue();
        });
    }
};
