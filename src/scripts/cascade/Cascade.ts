import VirtualNode from './VirtualNode';
import Observable from '../graph/Observable';
import Computed from '../graph/Computed';
import Graph from '../graph/Graph';

export default class Cascade {
    static createElement<T extends VirtualNode<U>, U>(type: string | (new (...args: any[]) => T), properties: U, ...children: Array<VirtualNode<any> | string>) {
        if (typeof type === 'string') {
            return new VirtualNode(type, properties, ...children);
        } else {
            return new type(undefined, properties, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: VirtualNode<any>, callback: (n: Node) => any) {
        var fixedNode: HTMLElement;
        if (typeof node === 'string') {
            fixedNode = document.getElementById(node);
        } else {
            fixedNode = node;
        }
        (virtualNode as any)._graph.observables.element.subscribe(function(value) {
            if (value) {
                while (fixedNode.firstChild) {
                    fixedNode.removeChild(fixedNode.firstChild);
                }
                fixedNode.appendChild(value);
                callback(value);
            }
        });
        var element = virtualNode.element;
    }

    static disposeAll(obj) {
        var graph = obj._graph;
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                if (graph && graph.observables[index]) {
                    var observable = graph.observables[index];
                    var value = observable.value;
                    observable.dispose();
                } else {
                    var value = obj[index];
                }
                if (value) {
                    Cascade.disposeAll(value);
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

    static createProperty(obj, property, observable) {
        Cascade.attachGraph(obj);
        if (obj._graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = obj._graph.observables[property].subscribers;
        }
        obj._graph.observables[property] = observable;
    }

    static createObservable(obj, property, value) {
        var observable = new Observable(value);
        Cascade.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return observable.getValue();
            },
            set: function(value) {
                observable.setValue(value);
            }
        });
    }

    static createComputed(obj, property, definition, defer?: boolean) {
        var computed = new Computed(definition, defer);
        Cascade.createProperty(obj, property, computed);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function() {
                return computed.getValue();
            }
        });
    }
}

export function observable(target: any, propertyKey: string): any {
    return {
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
                this._graph.observables[propertyKey] = new Observable(undefined);
            }
            return this._graph.observables[propertyKey].getValue();
        },
        set: function(value) {
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
                this._graph.observables[propertyKey] = new Observable(value);
            } else {
                this._graph.observables[propertyKey].setValue(value);
            }
        }
    };
}

export function computed(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
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
            this._graph.observables[propertyKey] = new Computed(definition, false, this);
        }
        return this._graph.observables[propertyKey].getValue();
    }
}
