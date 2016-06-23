var computedContexts: Array<any> = [];
var context: any = undefined;

export default class Observable {
    value: any;
    subscribers: Array<any>;

    constructor(value) {
        this.value = value;
        this.subscribers = [];
    }

    getValue() {
        if (context) {
            context.push(this);
        }
        return this.value;
    }
    peek() {
        return this.value;
    }
    setValue(value) {
        if (this.value !== value) {
            this.value = value;
            this.publish();
        }
    }
    subscribeOnly(subscriber) {
        if (subscriber) {
            this.subscribers.push(subscriber);
        }
    }
    subscribe(subscriber) {
        if (subscriber) {
            this.subscribers.push(subscriber);
            if (typeof subscriber.notify === 'function') {
                subscriber.notify(this.value);
            } else if (typeof subscriber === 'function') {
                subscriber(this.value);
            }
        }
    }
    unsubscribe(subscriber) {
        if (subscriber) {
            var index = this.subscribers.indexOf(subscriber);
            if (index >= 0) {
                this.subscribers.splice(index, 1);
            }
        }
    }
    publish() {
        for (var index = 0, length = this.subscribers.length; index < length; index++) {
            var subscriber = this.subscribers[index];
            if (typeof subscriber.notify === 'function') {
                subscriber.notify(this.value);
            } else if (typeof subscriber === 'function') {
                subscriber(this.value);
            }
        }
    }
    dispose() { }


    static getContext() {
        return context;
    }

    static pushContext() {
        context = [];
        computedContexts.unshift(context);
        return context;
    }

    static popContext() {
        var oldContext = computedContexts.shift();
        context = computedContexts[0];
        return oldContext;
    }
}
