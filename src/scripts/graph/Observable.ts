import { IObservable, ISubscriber, ISubscriberFunction } from './IObservable';

// Store ObservableContext in window to prevent multiple Cascade instance problem.
export interface IObservableContext {
    computedContexts: IObservable<any>[][];
    context: IObservable<any>[];
}
var observableContext: IObservableContext = window['$_cascade_observable_context'] || {};
window['$_cascade_observable_context'] = observableContext;
observableContext.computedContexts = observableContext.computedContexts || [];
observableContext.context = observableContext.context || undefined;

export default class Observable<T> implements IObservable<T> {
    value: T;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];

    constructor(value?: T) {
        this.value = value;
        this.subscribers = [];
    }

    // TODO: Change this to push only unique
    getValue() {
        if (observableContext.context) {
            observableContext.context.push(this);
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
    publish(value: T, oldValue?: T) {
        for (var index = 0, length = this.subscribers.length; index < length; index++) {
            var subscriber = this.subscribers[index];
            if (typeof subscriber === 'function') {
                subscriber(this.value, oldValue);
            } else {
                subscriber.notify();
            }
        }
    }

    dispose(recursive?: boolean) {
        this.subscribers.length = 0;
    }

    static getContext() {
        return observableContext.context;
    }

    static pushContext() {
        observableContext.context = [];
        observableContext.computedContexts.unshift(observableContext.context);
        return observableContext.context;
    }

    static popContext() {
        var oldContext = observableContext.computedContexts.shift();
        observableContext.context = observableContext.computedContexts[0];
        return oldContext;
    }
}
