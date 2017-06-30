declare var Reflect: any;

import { IObservable, ISubscriber, ISubscriberFunction } from './IObservable';
import Observable from './Observable';
import Computed from './Computed';
import ObservableArray from './ObservableArray';

/**
 * 
 */
export interface ObservableIndex {
    [index: string]: IObservable<any>;
}

/**
 * 
 */
export default class Graph {
    parent: any;
    observables: ObservableIndex = {};

    constructor(parent?: any) {
        this.parent = parent;
    }

    /**
     * 
     * @param property 
     */
    peek(property: string) {
        return this.observables[property].peek();
    }

    /**
     * 
     * @param property 
     */
    getReferences(property: string) {
        var observable = this.observables[property];
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
    getSubscribers(property: string) {
        var observable = this.observables[property];
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
    subscribe(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribe(subscriber);
        return value;
    }

    /**
     * 
     * @param property 
     * @param subscriber 
     */
    subscribeOnly(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribeOnly(subscriber);
        return value;
    }

    /**
     * 
     * @param property 
     * @param subscriber 
     */
    unsubscribe(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (this.observables[property]) {
            this.observables[property].subscribe(subscriber);
        }
    }
}
