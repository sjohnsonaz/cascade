declare var Reflect: any;

import {IObservable, ISubscriber, ISubscriberFunction} from './IObservable';
import Observable from './Observable';
import Computed from './Computed';
import ObservableArray from './ObservableArray';

export interface ObservableIndex {
    [index: string]: IObservable<any>;
}

export default class Graph {
    parent: any;
    observables: ObservableIndex = {};

    constructor(parent?: any) {
        this.parent = parent;
    }

    peek(property: string) {
        return this.observables[property].peek();
    }

    getReferences(property: string) {
        var observable = this.observables[property];
        if (observable instanceof Computed) {
            return observable.references;
        } else {
            return [];
        }
    }

    getSubscribers(property: string) {
        var observable = this.observables[property];
        if (observable) {
            return observable.subscribers;
        } else {
            return [];
        }
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
                var value = observable.peek();
                if (value && value._graph) {
                    value._graph.disposeAll();
                }
                observable.dispose();
            }
        }
    }

    subscribe(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribe(subscriber);
        return value;
    }

    subscribeOnly(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (!this.observables[property]) {
            // Force value to update.
            var value = this.parent[property];
        }
        this.observables[property].subscribeOnly(subscriber);
        return value;
    }

    unsubscribe(property: string, subscriber: ISubscriber | ISubscriberFunction<any>) {
        if (this.observables[property]) {
            this.observables[property].subscribe(subscriber);
        }
    }

    static disposeAll(obj) {
        var graph = obj._graph;
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                // Only dispose non-observable properties here.
                if (!graph || !graph.observables[index]) {
                    Graph.disposeAll(obj[index]);
                }
            }
        }

        if (graph) {
            for (var index in graph.observables) {
                if (graph.observables.hasOwnProperty(index)) {
                    var value = graph.observables[index].value;
                    Graph.disposeAll(value);
                    graph.observables[index].dispose();
                }
            }
        }
    }

    static attachGraph(obj) {
        if (!obj._graph) {
            Object.defineProperty(obj, '_graph', {
                configurable: true,
                writable: true,
                enumerable: false,
                value: new Graph(obj)
            });
        }
        return obj._graph as Graph;
    }

    static createProperty(obj: any, property: string, observable: IObservable<any>) {
        var graph = Graph.attachGraph(obj);
        if (graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = graph.observables[property].subscribers;
        }
        graph.observables[property] = observable;
    }

    static attachObservable<T>(obj: any, property: string, observable: IObservable<T>, readOnly: boolean = false) {
        Graph.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return observable.getValue();
            },
            set: readOnly ? undefined : function(value: T | Array<T>) {
                (observable as any).setValue(value);
            }
        });
    }

    static createObservable<T>(obj: any, property: string, value?: T) {
        Graph.attachObservable(obj, property, new Observable(value));
    }

    static createComputed<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean, setter?: (n: T) => any) {
        Graph.attachObservable(obj, property, new Computed(definition, defer, undefined, setter), true);
    }

    static createObservableArray<T>(obj: any, property: string, value?: Array<T>) {
        Graph.attachObservable<Array<T>>(obj, property, new ObservableArray(value));
    }

    static subscribe<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribe(property, subscriberFunction);
        }
    }

    static subscribeOnly<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribeOnly(property, subscriberFunction);
        }
    }

    static peek(obj: any, property: string) {
        return obj._graph ? (obj._graph as Graph).peek(property) : undefined;
    }

    static run(obj: any, property: string) {
        var graph: Graph = obj._graph;
        if (graph) {
            var observable = graph.observables[property];
            if (observable) {
                if ((observable as any).runOnly) {
                    return (observable as any).runOnly();
                } else {
                    return observable.peek();
                }
            }
        }
    }

    static getObservable(obj: any, property) {
        var graph: Graph = obj._graph;
        if (graph) {
            return graph.observables[property];
        }
    }

    static getSubscribers(obj: any, property) {
        var graph: Graph = obj._graph;
        if (graph) {
            return graph.getSubscribers(property);
        }
    }

    static getReferences(obj: any, property: string) {
        var graph: Graph = obj._graph;
        if (graph) {
            return graph.getReferences(property);
        }
    }

    static wrapContext(callback: () => any, thisArg?: any) {
        Observable.pushContext();
        if (thisArg) {
            callback.call(thisArg);
        } else {
            callback();
        }
        return Observable.popContext();
    }
}
