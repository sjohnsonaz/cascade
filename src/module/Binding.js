var Binding = (function () {
    function Binding(update, init, sources, destination, twoWay, updateArray) {
        Subscriber.call(this, this.bindingMethod);
        this.update = update;
        this.init = init;
        this.initialized = false;
        this.subscriptionComplete = false;
        this.cache = []; // {};
        this.sources = sources ? ((sources instanceof Array) ? sources : [sources]) : [];
        this.destination = destination;
        Object.defineProperty(this, 'twoWay', {
            value: !!twoWay,
            enumerable: true
        });
        this.updateArray = updateArray;

        //this.cache = {};
        if (!this.twoWay) {
            this.subscriptionComplete = false;

            if (this.destination) {
                if (this.destination.object.$module) {
                    this.destination.object.$module.addHandler(this);
                }
            }

            for (var index = 0, length = this.sources.length; index < length; index++) {
                if (index == length - 1) {
                    this.subscriptionComplete = true;
                }
                var source = this.sources[index];
                if (source instanceof Reference) {
                    this.sources[index].subscribe(this);
                } else {
                    this.notifyStatic(source, index);
                }
            }
        } else {
            this.subscriptionComplete = true;

            if (this.sources[0]) {
                this.sources[0].subscribe(this);
            }

            if (this.destination) {
                this.destination.subscribe(this);
            }
        }
    }

    Binding.prototype = Object.create(Subscriber.prototype, {
        constructor: {
            value: Binding
        }
    });
    Binding.prototype.notify = function (value, property, publisher, subscription) {
        //this.cache[property] = value;
        this.cache[this.subscriptions.indexOf(subscription)] = value;
        if (this.subscriptionComplete) {
            this.method(value, property, publisher, subscription);
        }
    };
    Binding.prototype.notifyStatic = function (value, index) {
        this.cache[index] = value;
        this.method(value, undefined, undefined, undefined, true);
    };
    Binding.prototype.bindingMethod = function (value, property, publisher, subscription, isStatic) {
        if (!this.twoWay || isStatic) {
            var result;
            if (!this.initialized) {
                this.initialized = true;
                if (this.init) {
                    //result = this.init(this.cache);
                    result = this.init.apply(this, this.cache);
                }
            } else {
                if (this.update) {
                    //result = this.update(this.cache);
                    result = this.update.apply(this, this.cache);
                }
            }
            if (this.destination) {
                this.destination.value = result;
            }
        } else {
            var result;
            if (!this.initialized) {
                this.initialized = true;
                if (this.init) {
                    //result = this.init(this.cache);
                    result = this.init.call(this, this.cache[0], false);
                }
            } else {
                //result = this.update(this.cache);
                if (this.sources[0].equalsSubscription(subscription)) {
                    result = this.update ? this.update.call(this, this.cache[0], false) : this.cache[0];
                    this.destination.lock(true, this);
                    this.destination.value = result;
                    this.destination.lock(false, this);
                } else if (this.destination.equalsSubscription(subscription)) {
                    result = this.update ? this.update.call(this, this.cache[1], true) : this.cache[1];
                    this.sources[0].lock(true, this);
                    this.sources[0].value = result;
                    this.sources[0].lock(false, this);
                }
            }
        }
    };

    Binding.prototype.handleArray = function (action, insertActions, deleteActions) {
        this.updateArray(this.cache[0], action, insertActions, deleteActions);
    };

    return Binding;
})();
