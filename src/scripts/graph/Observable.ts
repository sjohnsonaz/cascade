var computedContexts: Observable<any>[][] = [];
var context: Observable<any>[] = undefined;

export interface Subscriber {
    notify();
}

export interface SubscriberFunction<T> {
    (n: T, o?: T): void
}

export default class Observable<T> {
    value: T;
    subscribers: (Subscriber | SubscriberFunction<T>)[];

    // TODO: Add wrap and unwrap.
    constructor(value: T) {
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
    setValue(value: T) {
        if (this.value !== value) {
            var oldValue = this.value;
            this.value = value;
            this.publish(value, oldValue);
        }
    }
    subscribeOnly(subscriber: Subscriber | SubscriberFunction<T>) {
        if (subscriber) {
            this.subscribers.push(subscriber);
        }
    }
    subscribe(subscriber: Subscriber | SubscriberFunction<T>) {
        if (subscriber) {
            this.subscribers.push(subscriber);
            // TODO: Remove redundant type casting.
            if (typeof subscriber === 'function') {
                (subscriber as SubscriberFunction<T>)(this.value);
            } else {
                (subscriber as Subscriber).notify();
            }
        }
    }
    unsubscribe(subscriber: Subscriber | SubscriberFunction<T>) {
        if (subscriber) {
            var index = this.subscribers.indexOf(subscriber);
            if (index >= 0) {
                this.subscribers.splice(index, 1);
            }
        }
    }
    publish(value: T, oldValue: T) {
        for (var index = 0, length = this.subscribers.length; index < length; index++) {
            var subscriber = this.subscribers[index];
            // TODO: Remove redundant type casting.
            if (typeof subscriber === 'function') {
                (subscriber as SubscriberFunction<T>)(this.value, oldValue);
            } else {
                (subscriber as Subscriber).notify();
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
