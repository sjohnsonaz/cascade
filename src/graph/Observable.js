var Observable = (function () {
    function Observable(value) {
        Define.super(Subscribable, this);
        this.value = value;
    }

    Define.extend(Observable, Subscribable, {
        getValue: function () {
            var context = Graph.getContext();
            if (context) {
                context.references.push(this);
            }
            return this.value;
        },
        setValue: function (value) {
            this.value = value;
            this.publish();
        }
    });

    return Observable;
})();
