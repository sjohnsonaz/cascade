// TODO: Remove Proxy check
declare var Proxy: any;

import Graph from '../graph/Graph';
import { IObservable, ISubscriber, ISubscriberFunction, IArray, IHash } from '../graph/IObservable';
import Observable from '../graph/Observable';
import Computed from '../graph/Computed';
import ObservableArrayLegacy from '../graph/ObservableArrayLegacy';
import ObservableArray from '../graph/ObservableArray';
import ObservableHash from '../graph/ObservableHash';

import { IVirtualNode, IVirtualNodeProps } from '../dom/IVirtualNode';
import VirtualNode from '../dom/VirtualNode';
import Fragment from '../dom/Fragment';
import ComponentNode from '../dom/ComponentNode';
import { Component } from '../dom/Component';

export default class Cascade {
    /**
     * Dispose all Observables in a Graph
     * @param obj 
     */
    static disposeAll(obj: any) {
        var graph = obj._graph;
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                // Only dispose non-observable properties here.
                if (!graph || !graph.observables[index]) {
                    Cascade.disposeAll(obj[index]);
                }
            }
        }

        if (graph) {
            for (var index in graph.observables) {
                if (graph.observables.hasOwnProperty(index)) {
                    var value = graph.observables[index].value;
                    Cascade.disposeAll(value);
                    graph.observables[index].dispose();
                }
            }
        }
    }

    /**
     * Attach a Graph to an object
     * @param obj the object on which to attach a Graph
     */
    static attachGraph(obj: any) {
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

    /**
     * 
     * @param obj the object on which to define a property
     * @param property the name of the property
     * @param observable the IObservable to store the property value
     */
    static createProperty<T, U extends keyof T>(obj: T, property: U, observable: IObservable<T[U]>) {
        var graph = Cascade.attachGraph(obj);
        if (graph.observables[property]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = graph.observables[property].subscribers;
        }
        graph.observables[property] = observable;
    }

    /**
     * 
     * @param obj the object on which to define a property
     * @param property the name of the property
     * @param observable the IObservable to store the property value
     * @param readOnly the Boolean specifying if this property is read only
     */
    static attachObservable<T, U extends keyof T>(obj: T, property: U, observable: IObservable<T[U]>, readOnly: boolean = false) {
        Cascade.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function () {
                return observable.getValue();
            },
            set: readOnly ? undefined : function (value: T[U] | Array<T[U]>) {
                (observable as any).setValue(value);
            }
        });
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservable<T, U extends keyof T>(obj: T, property: U, value?: T[U]) {
        Cascade.attachObservable(obj, property, new Observable(value));
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param definition 
     * @param defer 
     * @param setter 
     */
    static createComputed<T, U extends keyof T>(obj: T, property: U, definition: (n?: T[U]) => T[U], defer?: boolean, setter?: (n: T[U]) => any) {
        Cascade.attachObservable(obj, property, new Computed(definition, defer, undefined, setter), true);
    }

    // TODO: Remove Proxy check
    /**
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableArray<T, U extends keyof T, V extends keyof T[U]>(obj: T, property: U, value?: T[U]) {
        Cascade.attachObservable<T, U>(obj, property, Cascade.proxyAvailable ? new ObservableArray<any>(value as any) : new ObservableArrayLegacy<any>(value as any) as any);
    }

    /** 
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableHash<T, U extends keyof T, V extends keyof T[U]>(obj: T, property: U, value?: T[U]) {
        Cascade.attachObservable<T, U>(obj, property, new ObservableHash<T[U]>(value as any) as any);
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param subscriberFunction 
     */
    static subscribe<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>, createDisposer: boolean = false) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribe(property, subscriberFunction);
        }
        return createDisposer ? function () {
            graph.unsubscribe(property, subscriberFunction);
        } : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param subscriberFunction 
     */
    static subscribeOnly<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>, createDisposer: boolean = false) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribeOnly(property, subscriberFunction);
        }
        return createDisposer ? function () {
            graph.unsubscribe(property, subscriberFunction);
        } : undefined;
    }

    static unsubscribe<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.unsubscribe(property, subscriberFunction);
        }
    }

    static waitToEqual<T>(obj: any, property: string, testValue: T, timeout?: number) {
        var graph: Graph = obj._graph;
        if (graph) {
            return new Promise<T>((resolve, reject) => {
                let resolved = false;
                let subscriberFunction = (value: T) => {
                    if (value === testValue) {
                        if (timerId) {
                            window.clearTimeout(timerId);
                        }
                        if (!resolved) {
                            resolved = true;
                            window.setTimeout(() => {
                                graph.unsubscribe(property, subscriberFunction);
                            });
                            resolve(value);
                        }
                    }
                };
                if (timeout) {
                    var timerId = window.setTimeout(() => {
                        graph.unsubscribe(property, subscriberFunction);
                        reject(new Error('Timeout elapsed'));
                    }, timeout);
                }
                graph.subscribeOnly(property, subscriberFunction);
            });
        } else {
            return Promise.reject('Cannot subscribe to Object');
        }
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static peek<T, U extends keyof T>(obj: T, property: U) {
        return obj['_graph'] ? (obj['_graph'] as Graph).peek<T[U]>(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static peekDirty<T, U extends keyof T>(obj: T, property: U) {
        return obj['_graph'] ? (obj['_graph'] as Graph).peekDirty<T[U]>(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static update<T, U extends keyof T>(obj: T, property: U) {
        let graph: Graph = obj['_graph'];
        let observable = (graph ? graph.observables[property] : undefined) as Computed<T[U]>;
        if (observable && observable.update) {
            return observable.update();
        } else {
            throw new Error('No observable attached to Object: ' + property);
        }
    }

    static set<T, U extends keyof T>(obj: T, property: U, value: T[U]) {
        let graph: Graph = obj['_graph'];
        let observable = (graph ? graph.observables[property] : undefined) as IObservable<T[U]>;
        if (observable) {
            return observable.setValue(value);
        } else {
            throw new Error('No observable attached to Object: ' + property);
        }
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static run<T, U extends keyof T>(obj: T, property: U) {
        let graph: Graph = obj['_graph'];
        let observable = (graph ? graph.observables[property] : undefined) as IObservable<T[U]>;
        if (observable) {
            if ((observable as Computed<T[U]>).runOnly) {
                return (observable as Computed<T[U]>).runOnly();
            } else {
                return observable.peek();
            }
        } else {
            throw new Error('No observable attached to Object: ' + property);
        }
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getObservable<T, U extends keyof T>(obj: T, property: U) {
        var graph: Graph = obj['_graph'];
        return (graph ? graph.observables[property] : undefined) as IObservable<T[U]>;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getSubscribers<T, U extends keyof T>(obj: T, property: U) {
        var graph: Graph = obj['_graph'];
        return graph ? graph.getSubscribers<T[U]>(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getReferences<T, U extends keyof T>(obj: T, property: U) {
        var graph: Graph = obj['_graph'];
        return graph ? graph.getReferences(property) : undefined;
    }

    /**
     * 
     * @param callback 
     * @param thisArg 
     */
    static wrapContext(callback: () => any, thisArg?: any) {
        Observable.pushContext();
        if (thisArg) {
            callback.call(thisArg);
        } else {
            callback();
        }
        return Observable.popContext();
    }

    static createElement<T extends IVirtualNodeProps>(type: string | (new (props: T, ...children: Array<any>) => Component<T>), props: T, ...children: Array<any>): IVirtualNode<T> {
        if (typeof type === 'string') {
            return new VirtualNode(type, props, ...children);
        } else {
            return new ComponentNode(type, props, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>) {
        var fixedNode = typeof node === 'string' ?
            document.getElementById(node) :
            node;
        var renderedComponent = virtualNode.toNode();
        while (fixedNode.firstChild) {
            fixedNode.removeChild(fixedNode.firstChild);
        }
        if (renderedComponent instanceof Node) {
            fixedNode.appendChild(renderedComponent);
        } else {
            console.error('Root render is not a Node.  Nothing was rendered, and nothing will be updated');
        }
        return renderedComponent;
    }

    static Fragment = Fragment;

    static proxyAvailable: boolean = typeof Proxy !== 'undefined';
    static reflectAvailable: boolean = (typeof Reflect === 'object' && typeof Reflect.getMetadata === 'function');
}