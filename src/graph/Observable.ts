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
    id: number;
    value: T;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];
    alwaysNotify: boolean;
    protected promise: Promise<void>;

    static id: number = 0;

    constructor(value?: T) {
        this.value = value;
        this.subscribers = [];

        this.id = Observable.id;
        Observable.id++;
    }

    getValue() {
        if (observableContext.context) {
            observableContext.context.push(this);
        }
        return this.value;
    }

    peek() {
        return this.value;
    }

    peekDirty() {
        return this.value;
    }

    track() {
        return this.promise || Promise.resolve();
    }

    async setValue(value: T) {
        if (this.value !== value || this.alwaysNotify) {
            var oldValue = this.value;
            this.value = value;
            this.promise = this.publish(value, oldValue);
            await this.promise;
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

    async publish(value: T, oldValue?: T) {
        if (this.subscribers.length) {
            let subscribers = this.subscribers.filter((subscriber) => {
                if (typeof subscriber === 'function') {
                    subscriber(this.value, oldValue);
                    return false;
                } else {
                    return true;
                }
            }).map((subscriber: ISubscriber) => subscriber.notify())
            let result = await Promise.all(subscribers);
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
