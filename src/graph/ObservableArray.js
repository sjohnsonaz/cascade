var ObservableArray = (function () {
    function ObservableArray(value) {
        Define.super(Subscribable, this);
        this.value = value;
    }

    Define.extend(ObservableArray, Subscribable, {
        setValue: function (value) {
            if (this.value !== value) {
                this.value = value;
                this.publish();
            }
        }
    });

    ObservableArray.prototype = {

    };

    return ObservableArray;
})();
