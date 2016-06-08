var Observable = (function () {
    function Observable(value) {
        this.value = value;
        this.subscribers = [];
    }

    Observable.prototype = {
        getValue: function () {
            if (context) {
                context.push(this);
            }
            return this.value;
        },
        setValue: function (value) {
            if (this.value !== value) {
                this.value = value;
                this.publish();
            }
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
        },
        dispose: function () {}
    };

    var computedContexts = [];
    var context = undefined;

    function getContext() {
        return context;
    }

    function pushContext() {
        context = [];
        computedContexts.unshift(context);
        return context;
    }

    function popContext() {
        var oldContext = computedContexts.shift();
        context = computedContexts[0];
        return oldContext;
    }

    Observable.getContext = getContext;
    Observable.pushContext = pushContext;
    Observable.popContext = popContext;

    return Observable;
})();
