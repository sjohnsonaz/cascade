declare var Reflect: any;

import {IObservable, ISubscriber, ISubscriberFunction} from './IObservable';
import Observable from './Observable';
import Computed from './Computed';
import ObservableArray from './ObservableArray';

export interface ObservableIndex {
    [index: string]: Observable<any>;
}

export default class Graph {
    parent: any;
    observables: ObservableIndex = {};

    constructor(parent?: any) {
        this.parent = parent;
    }

    peek(property: string) {
        return this.observables[property].value;
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
                if (observable.value && observable.value._graph) {
                    observable.value._graph.disposeAll();
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
    }

    static createProperty(obj: any, property: string, observable: Observable<any>) {
        Graph.attachGraph(obj);
        if (obj._graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = obj._graph.observables[property].subscribers;
        }
        obj._graph.observables[property] = observable;
    }

    static createObservable<T>(obj: any, property: string, value: T) {
        var observable = new Observable(value);
        Graph.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return observable.getValue();
            },
            set: function(value: T) {
                observable.setValue(value);
            }
        });
    }

    static createComputed<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean) {
        var computed = new Computed(definition, defer);
        Graph.createProperty(obj, property, computed);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return computed.getValue();
            }
        });
    }

    static subscribe<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribe(property, subscriberFunction);
        }
    }

    static peek(obj: any, property: string) {
        var graph: Graph = obj._graph;
        if (graph) {
            return graph.peek(property);
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
}

export function array<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function() {
            // Graph is not initialized
            if (!this._graph) {
                Object.defineProperty(this, '_graph', {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: new Graph(this)
                });
            }
            // Property does not exist
            if (!this._graph.observables[propertyKey]) {
                this._graph.observables[propertyKey] = new ObservableArray<T>(undefined);
            }
            return this._graph.observables[propertyKey].getValue();
        },
        set: function(value: Array<T>) {
            // Graph is not initialized
            if (!this._graph) {
                Object.defineProperty(this, '_graph', {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: new Graph(this)
                });
            }
            // Property does not exist
            if (!this._graph.observables[propertyKey]) {
                this._graph.observables[propertyKey] = new ObservableArray<T>(value);
            } else {
                this._graph.observables[propertyKey].setValue(value);
            }
        }
    });
}

export function observable<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
    if (descriptor) {
        var definition = descriptor.get;
        descriptor.enumerable = true;
        descriptor.get = function() {
            // Graph is not initialized
            if (!this._graph) {
                Object.defineProperty(this, '_graph', {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: new Graph(this)
                });
            }
            // Property does not exist
            if (!this._graph.observables[propertyKey]) {
                this._graph.observables[propertyKey] = new Computed<T>(definition, false, this);
            }
            return this._graph.observables[propertyKey].getValue();
        }
    } else {
        // Only use Reflection if it exists.
        var typeName;
        if (typeof Reflect === 'object' && typeof Reflect.getMetadata === "function") {
            var type = Reflect.getMetadata("design:type", target, propertyKey);
            if (type) {
                typeName = type.name;
            }
        }
        if (typeName === 'Array') {
            array(target, propertyKey, descriptor);
        } else {
            Object.defineProperty(target, propertyKey, {
                enumerable: true,
                configurable: true,
                get: function() {
                    // Graph is not initialized
                    if (!this._graph) {
                        Object.defineProperty(this, '_graph', {
                            configurable: true,
                            writable: true,
                            enumerable: false,
                            value: new Graph(this)
                        });
                    }
                    // Property does not exist
                    if (!this._graph.observables[propertyKey]) {
                        this._graph.observables[propertyKey] = new Observable<T>(undefined);
                    }
                    return this._graph.observables[propertyKey].getValue();
                },
                set: function(value: T) {
                    // Graph is not initialized
                    if (!this._graph) {
                        Object.defineProperty(this, '_graph', {
                            configurable: true,
                            writable: true,
                            enumerable: false,
                            value: new Graph(this)
                        });
                    }
                    // Property does not exist
                    if (!this._graph.observables[propertyKey]) {
                        this._graph.observables[propertyKey] = new Observable<T>(value);
                    } else {
                        this._graph.observables[propertyKey].setValue(value);
                    }
                }
            });
        }
    }
}

export function computed<T>(definition: (n: T) => T) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): any {
        return {
            enumerable: true,
            get: function() {
                // Graph is not initialized
                if (!this._graph) {
                    Object.defineProperty(this, '_graph', {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: new Graph(this)
                    });
                }
                // Property does not exist
                if (!this._graph.observables[propertyKey]) {
                    this._graph.observables[propertyKey] = new Computed<T>(definition, false, this);
                }
                return this._graph.observables[propertyKey].getValue();
            }
        };
    }
}
