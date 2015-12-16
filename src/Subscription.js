var Subscription = (function () {
    function Subscription(publisher, property, subscriber) {
        this.publisher = publisher;
        this.property = property;
        this.subscriber = subscriber;
        this.value = undefined;

        if (subscriber instanceof Subscriber) {
            subscriber.addSubscription(this);
        }
    }

    Subscription.prototype = {
        notify: function (value) {
            this.value = value;
            switch (typeof this.subscriber) {
                case 'function':
                    this.subscriber(value);
                    break;
                case 'object':
                    this.subscriber.notify(value, this.property, this.publisher, this);
                    break;
            }
        },
        destroy: function () {
            if (this.subscriber instanceof Subscriber) {
                this.subscriber.removeSubscription(this);
            }
        }
    }

    return Subscription;
})();
