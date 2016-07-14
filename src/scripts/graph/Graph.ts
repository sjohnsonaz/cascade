import Observable, {Subscriber, SubscriberFunction} from './Observable';
import Computed from './Computed';

export interface ObservableIndex {
    [index: string]: Observable<any>;
}

export default class Graph {
    parent: any;
    observables: ObservableIndex = {};

    constructor(parent?: any) {
        this.parent = parent;
    }

    peekValue(obj: any, property: string) {
        return obj.observables[property].value;
    }

    dispose() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                this.observables[index].dispose();
            }
        }
    }

    disposeAll() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                var observable = this.observables[index];
                if (observable.value && observable.value._graph) {
                    observable.value._graph.disposeAll();
                }
                observable.dispose();
            }
        }
    }

    subscribe(property: string, subscriber: Subscriber | SubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribe(subscriber);
    }

    subscribeOnly(property: string, subscriber: Subscriber | SubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribeOnly(subscriber);
    }

    unsubscribe(property: string, subscriber: Subscriber | SubscriberFunction<any>) {
        if (this.observables[property]) {
            this.observables[property].subscribe(subscriber);
        }
    }
}
