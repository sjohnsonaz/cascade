var Module = (function () {
    function Module(obj) {
        this.self = obj;
        this.subscribers = {}; // Modules subscribed to this
        this.handlers = []; // Bindings attached to this as a destination
        this.propertyCache = {}; // Cached property values
        this.publishLocks = {}; // Locks by object
        this.publishStops = {}; // Locks
        this.references = {};
    }

    Module.prototype = {
        /**
         * @method subscribe
         * @param property
         * @param subscriber
         * @param deferNotify
         */
        subscribe: function (property, subscriber, deferNotify) {
            if (subscriber) {
                this.subscribers[property] = this.subscribers[property] || [];
                // TODO: Do we need to create a Subscription if subscriber IS a Subscription?
                var subscription = new Subscription(this, property, subscriber);
                this.subscribers[property].push(subscription);
                if (!deferNotify) {
                    this.publish(property, subscription);
                }
                return subscription;
            }
        },
        /**
         * @method getSubscription
         * @param property
         * @param subscriber
         */
        getSubscription: function (property, subscriber) {
            var subscribers = this.subscribers[property];
            if (subscribers) {
                for (var index = 0, length = subscribers.length; index < length; index++) {
                    if (subscribers[index].subscriber == subscriber) {
                        return subscribers[index];
                    }
                }
            }
        },
        /**
         * @method unsubscribe
         * @param subscription
         * @param isDestroying
         */
        unsubscribe: function (subscription, isDestroying) {
            if (subscription instanceof Subscription) {
                var property = subscription.property;
                if (this.subscribers[property]) {
                    var index = this.subscribers[property].indexOf(subscription);
                    if (index != -1) {
                        this.subscribers[property].splice(index, 1);
                        if (typeof subscription.subscriber === 'object' && !isDestroying) {
                            subscription.subscriber.removeSubscription(subscription);
                        }
                        if (this.subscribers[property].length == 0) {
                            delete this.subscribers[property];
                        }
                    }
                }
            }
        },
        /**
         * @method publish
         * @param property
         * @param subscriber
         * Publish to a single subscriber, or all subscribers.
         */
        publish: function (property, subscriber) {
            var self = this;
            var value = this.self[property];
            if (subscriber) {
                switch (typeof subscriber) {
                    case 'function':
                        subscriber(value);
                        break;
                    case 'object':
                        var subscription = (subscriber instanceof Subscription) ? subscriber : this.getSubscription(property, subscriber);
                        if (subscription) {
                            subscription.notify(value);
                        }
                        break;
                }
            } else {
                var subscribers = this.subscribers[property];
                if (subscribers) {
                    // TODO: Attempt to change to for loop.  This is to protect against deleted subscribers.
                    subscribers.forEach(function (subscription, index, array) {
                        if (!self.isLocked(property, subscription.subscriber)) {
                            subscription.notify(value);
                        }
                    }, this);
                }
            }
        },
        cacheValue: function (property, value) {
            if (typeof this.propertyCache[property] === 'function') {
                this.propertyCache[property](value);
            }
        },
        lock: function (property, lock, locker) {
            if (locker) {
                this.publishLocks[property] = this.publishLocks[property] || [];
                if (lock) {
                    if (this.publishLocks[property].indexOf(locker) == -1) {
                        this.publishLocks[property].push(locker);
                    }
                } else {
                    var index = this.publishLocks[property].indexOf(locker);
                    if (index != -1) {
                        this.publishLocks[property].splice(index, 1);
                    }
                }
            } else {
                if (lock) {
                    this.publishStops[property] = true;
                } else {
                    delete this.publishStops[property];
                }
            }
        },
        isLocked: function (property, locker) {
            if (this.publishStops[property]) {
                return true;
            } else if (locker) {
                var publishLock = this.publishLocks[property];
                if (publishLock && publishLock.length) {
                    return publishLock.indexOf(locker) != -1;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /**
         * @method addHandler
         * @param handler
         */
        addHandler: function (handler) {
            if (!this.handlers) {
                this.handlers = [handler];
            } else if (this.handlers.indexOf(handler) == -1) {
                this.handlers.push(handler);
            }
        },
        /**
         * @method removeHandler
         * @param handler
         */
        removeHandler: function (handler) {
            if (this.handlers) {
                var index = this.handlers.indexOf(handler);
                if (index != -1) {
                    this.handlers.splice(index, 1);
                }
            }
        },
        /**
         * @method destroy
         */
        destroy: function (isDestroying) {
            // Unsubscribe from all.
            if (this.subscribers) {
                // TODO: Determine if Object.hasOwnProperty is necessary
                for (var property in this.subscribers) {
                    var propertySubscribers = this.subscribers[property];
                    for (var index = 0, length = propertySubscribers.length; index < length; index++) {
                        var subscription = propertySubscribers[index];
                        // TODO: Destroy function subscribers
                        if (typeof subscription.subscriber === 'object') {
                            subscription.subscriber.removeSubscription(subscription);
                        }
                    }
                }
                this.subscribers.length = 0;
            }

            // Destroy all subscriptions
            if (this.subscriptions) {
                for (var index = 0, length = this.subscriptions.length; index < length; index++) {
                    var subscription = this.subscriptions[index];
                    subscription.publisher.unsubscribe(subscription, true);
                }
                this.subscriptions.length = 0;
            }

            // Destroy all binding handlers.
            if (this.handlers) {
                // TODO: Determine if Object.hasOwnProperty is necessary
                for (var property in this.handlers) {
                    this.handlers[property].destroy();
                    delete this.handlers[property];
                }
            }
        },
        /**
         * @method bind
         */
        bind: function (definition) {
            if (definition instanceof Array) {
                for (var index = 0, length = definition.length; index < length; index++) {
                    var handlerDefinition = definition[index];
                    if (handlerDefinition.handler === 'bind') {
                        property.bind(handlerDefinition);
                    } else {
                        handlerDefinition.destination = handlerDefinition.destination || this;
                        switch (typeof handlerDefinition.handler) {
                            case 'string':
                                Module.handlers[handlerDefinition.handler].create(handlerDefinition);
                                break;
                            case 'function':
                                handlerDefinition.handler.create(handlerDefinition);
                                break;
                        }
                    }
                }
            } else {
                for (var property in definition) {
                    if (definition.hasOwnProperty(property)) {
                        this.self[property].bind(definition[property]);
                    }
                }
            }
        }
    };

    Module.init = function (obj) {
        if (!obj.$module) {
            Object.defineProperty(obj, '$module', {
                value: new Module(obj),
                writable: false,
                configurable: false,
                enumerable: false
            });
        }
    }

    Module.watchProperties = function (obj, descriptor) {
        for (var property in descriptor) {
            if (descriptor.hasOwnProperty(property)) {
                Module.watchProperty(obj, property, descriptor[property]);
            }
        }
    };

    Module.watchProperty = function (obj, property, descriptor) {
        descriptor = merge({}, descriptor);

        var value = descriptor.value;
        var get = descriptor.get;
        var set = descriptor.set;
        var thisArg = descriptor.thisArg;
        var definition = descriptor.definition;
        var innerName = descriptor.innerName;
        var getter = descriptor.getter;
        var setter = descriptor.setter;

        Module.init(obj);
        innerName = innerName || property;
        var hidden;

        function callGetter(innerName) {
            if (getter) {
                return getter(innerName);
            } else {
                return hidden;
            }
        }

        function callSetter(innerName, value) {
            if (setter) {
                setter(innerName, value);
            }
            hidden = value;
        }

        if (typeof set === 'function') {
            if (thisArg) {
                hidden = set.call(thisArg, value, undefined, cancel)
            } else {
                hidden = set(value, undefined, cancel);
            }
            if (hidden === cancel) {
                hidden = undefined;
            }
        } else {
            hidden = value;
        }
        if (hidden !== undefined) {
            var cache = value;
            callSetter(innerName, hidden);
        }
        obj.$module.propertyCache = obj.$module.propertyCache || {};
        obj.$module.propertyCache[property] = function (value) {
            cache = value;
        };
        Object.defineProperty(obj, property, merge({
            configurable: true,
            enumerable: true,
            get: typeof get === 'function' ? function () {
                return thisArg ? get.call(thisArg, callGetter(innerName), obj) : get(callGetter(innerName), obj);
            } : function () {
                return callGetter(innerName);
            },
            set: typeof set === 'function' ? function (value) {
                if (value !== cache) {
                    var newValue = thisArg ? set.call(thisArg, value, hidden, cancel) : set(value, hidden, cancel);
                    if (newValue !== cancel) {
                        callSetter(innerName, newValue);
                        cache = value;
                        hidden = newValue;
                        obj.$module.publish(property);
                    }
                }
            } : function (value) {
                if (value !== cache) {
                    callSetter(innerName, value);
                    cache = value;
                    hidden = value;
                    obj.$module.publish(property);
                }
            }
        }, definition));

        if (!obj.$module.references[property]) {
            Object.defineProperty(obj.$module.references, property, {
                value: new Reference(obj, property)
            });
        }
    };

    Module.handlers = {};

    function merge(a, b, c) {
        if (b) {
            for (var member in b) {
                if (b.hasOwnProperty(member)) {
                    a[member] = b[member];
                }
            }
        }
        if (c) {
            for (var member in c) {
                if (b.hasOwnProperty(member)) {
                    a[member] = c[member];
                }
            }
        }
        return a;
    }

    return Module;
})();
