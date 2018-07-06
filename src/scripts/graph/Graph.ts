import { IObservable, ISubscriber, ISubscriberFunction } from './IObservable';
import Computed from './Computed';

/**
 * 
 */
export interface ObservableIndex {
    [index: string]: IObservable<any>;
}

/**
 * 
 */
export default class Graph<T = any> {
    parent: any;
    observables: ObservableIndex = {};

    constructor(parent?: any) {
        this.parent = parent;
    }

    /**
     * 
     * @param property 
     */
    peek<U extends keyof T>(property: U) {
        return this.observables[property as string].peek() as T[U];
    }

    peekDirty<U extends keyof T>(property: U) {
        return this.observables[property as string].peekDirty() as T[U];
    }

    track<U extends keyof T>(property: U) {
        return this.observables[property as string].track();
    }

    trackAll() {
        return Promise.all<void>(Object.values(this.observables).map(observable => observable.track()));
    }

    /**
     * 
     * @param property 
     */
    getReferences<U extends keyof T>(property: U) {
        var observable = this.observables[property as string] as IObservable<any>;
        if (observable instanceof Computed) {
            return observable.references;
        } else {
            return [];
        }
    }

    /**
     * 
     * @param property 
     */
    getSubscribers<U extends keyof T>(property: U) {
        var observable = this.observables[property as string] as IObservable<T[U]>;
        if (observable) {
            return observable.subscribers;
        } else {
            return [];
        }
    }

    /**
     * 
     */
    dispose() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                this.observables[index].dispose();
            }
        }
    }

    /**
     * 
     */
    disposeAll() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                var observable = this.observables[index];
                var value = observable.peek();
                if (value && value._graph) {
                    value._graph.disposeAll();
                }
                observable.dispose();
            }
        }
    }

    /**
     * 
     * @param property 
     * @param subscriber 
     */
    subscribe<U extends keyof T>(property: U, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property as string]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property as string].subscribe(subscriber);
        return value;
    }

    /**
     * 
     * @param property 
     * @param subscriber 
     */
    subscribeOnly<U extends keyof T>(property: U, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property as string]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property as string].subscribeOnly(subscriber);
        return value;
    }

    /**
     * 
     * @param property 
     * @param subscriber 
     */
    unsubscribe<U extends keyof T>(property: U, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (this.observables[property as string]) {
            this.observables[property as string].unsubscribe(subscriber);
        }
    }

    /**
     * 
     * @param property 
     * @param alwaysNotify 
     */
    setAlwaysNotify<U extends keyof T>(property: U, alwaysNotify: boolean) {
        if (!this.observables[property as string]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property as string].alwaysNotify = alwaysNotify;
    }
}
