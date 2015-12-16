var Reference = (function () {
    function Reference(obj, property) {
        var self = this;
        this.object = obj;
        this.property = property;
        Object.defineProperty(this, 'value', {
            get: function () {
                return self.object[self.property]
            },
            set: function (value) {
                self.object[self.property] = value;
            }
        });
    }

    Reference.prototype = {
        subscribe: function (subscriber, deferNotify) {
            this.object.$module.subscribe(this.property, subscriber, deferNotify);
        },
        lock: function (lock, locker) {
            this.object.$module.lock(this.property, lock, locker);
        },
        equalsSubscription(subscription) {
            return this.object.$module == subscription.publisher && this.property == subscription.property;
        }
    };

    return Reference;
})();
