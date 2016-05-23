var Subscribable = (function () {
    function Subscribable(value) {
        this.value = value;
        this.subscribers = [];
    }

    Subscribable.prototype = {
        subscribe: function (callback) {
            if (callback) {
                this.subscribers.push(callback);
                callback(this.value);
            }
        },
        unsubscribe: function (callback) {
            if (callback) {
                var index = this.subscribers.indexOf(callback);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            }
        },
        publish: function () {
            for (var index = 0, length = this.subscribers.length; index < length; index++) {
                var subscriber = this.subscribers[index];
                subscriber(this.value);
            }
        }
    };

    return Subscribable;
})();
