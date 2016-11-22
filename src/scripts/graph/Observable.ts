import {IObservable, ISubscriber, ISubscriberFunction} from './IObservable';

var computedContexts: IObservable<any>[][] = [];
var context: IObservable<any>[] = undefined;

export default class Observable<T> implements IObservable<T> {
    value: T;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];

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
            if (typeof subscriber === 'function') {
                subscriber(this.value);
            } else {
                subscriber.notify();
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
            if (typeof subscriber === 'function') {
                subscriber(this.value, oldValue);
            } else {
                subscriber.notify();
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
