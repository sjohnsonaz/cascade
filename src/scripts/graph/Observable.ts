import {IObservable, ISubscriber, ISubscriberFunction} from './IObservable';

var computedContexts: Observable<any>[][] = [];
var context: Observable<any>[] = undefined;

export default class Observable<T> implements IObservable<T> {
    value: T;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];

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
    subscribeOnly(subscriber: ISubscriber | ISubscriberFunction<T>) {
        if (subscriber) {
            this.subscribers.push(subscriber);
        }
    }
    subscribe(subscriber: ISubscriber | ISubscriberFunction<T>) {
        if (subscriber) {
            this.subscribers.push(subscriber);
            // TODO: Remove redundant type casting.
            if (typeof subscriber === 'function') {
                (subscriber as ISubscriberFunction<T>)(this.value);
            } else {
                (subscriber as ISubscriber).notify();
            }
        }
    }
    unsubscribe(subscriber: ISubscriber | ISubscriberFunction<T>) {
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
                (subscriber as ISubscriberFunction<T>)(this.value, oldValue);
            } else {
                (subscriber as ISubscriber).notify();
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
