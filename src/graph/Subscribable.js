var Subscribable = (function () {
    function Subscribable(value) {
        this.value = value;
        this.subscribers = [];
    }

    Subscribable.prototype = {
        getValue: function () {
            var context = getContext();
            if (context) {
                context.push(this);
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

    var computedContexts = [];

    function getContext() {
        return computedContexts[computedContexts.length - 1];
    }

    function pushContext() {
        var context = [];
        computedContexts.push(context);
        return context;
    }

    function popContext() {
        return computedContexts.pop();
    }

    Subscribable.getContext = getContext;
    Subscribable.pushContext = pushContext;
    Subscribable.popContext = popContext;

    return Subscribable;
})();
