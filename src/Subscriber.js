var Subscriber = (function () {
    function Subscriber(method) {
        this.method = method;
        this.subscriptions = []; // This module's subscriptions
    }

    Subscriber.prototype = {
        notify: function (value, property, publisher, subscription) {
            this.method(value, property, publisher, subscription);
        },
        /**
         * @method addSubscription
         * @param subscription
         */
        addSubscription: function (subscription) {
            this.subscriptions.push(subscription);
        },
        /**
         * @method removeSubscription
         * @param subscription
         */
        removeSubscription: function (subscription) {
            var index = this.subscriptions.indexOf(subscription);
            if (index != -1) {
                this.subscriptions.splice(index, 1);
            }
        }
    }

    return Subscriber;
})();
