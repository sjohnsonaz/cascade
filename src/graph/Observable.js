var Observable = (function () {
    function Observable(value) {
        Define.super(Subscribable, this);
        this.value = value;
    }

    Define.extend(Observable, Subscribable, {
        setValue: function (value) {
            if (this.value !== value) {
                this.value = value;
                this.publish();
            }
        }
    });

    return Observable;
})();
