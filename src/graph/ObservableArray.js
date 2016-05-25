var ObservableArray = (function () {
    function ObservableArray(value) {
        Define.super(Observable, this);
        this.value = value;
    }

    Define.extend(ObservableArray, Observable, {
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
