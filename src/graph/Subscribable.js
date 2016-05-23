var Subscribable = (function () {
    function Subscribable(value) {
        this.value = value;
        this.subscribers = [];
    }

    Subscribable.prototype = {
        getValue: function () {
            var context = Graph.getContext();
            if (context) {
                context.references.push(this);
            }
            return this.value;
        },
        subscribeOnly: function (subscriber) {
            if (subscriber) {
                this.subscribers.push(subscriber);
            }
        },
        subscribe: function (subscriber) {
            if (subscriber) {
                this.subscribers.push(subscriber);
                if (typeof subscriber.notify === 'function') {
                    subscriber.notify(this.value);
                } else if (typeof subscriber === 'function') {
                    subscriber(this.value);
                }
            }
        },
        unsubscribe: function (subscriber) {
            if (subscriber) {
                var index = this.subscribers.indexOf(subscriber);
                if (index >= 0) {
                    this.subscribers.splice(index, 1);
                }
            }
        },
        publish: function () {
            for (var index = 0, length = this.subscribers.length; index < length; index++) {
                var subscriber = this.subscribers[index];
                if (typeof subscriber.notify === 'function') {
                    subscriber.notify(this.value);
                } else if (typeof subscriber === 'function') {
                    subscriber(this.value);
                }
            }
        }
    };

    return Subscribable;
})();
