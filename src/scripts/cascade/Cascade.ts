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
    static createProperty(obj: any, property: string, observable: IObservable<any>) {
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
    static attachObservable<T>(obj: any, property: string, observable: IObservable<T>, readOnly: boolean = false) {
        Cascade.createProperty(obj, property, observable);
        Object.defineProperty(obj, property, {
            enumerable: true,
            configurable: true,
            get: function () {
                return observable.getValue();
            },
            set: readOnly ? undefined : function (value: T | Array<T>) {
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
    static createObservable<T>(obj: any, property: string, value?: T) {
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
    static createComputed<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean, setter?: (n: T) => any) {
        Cascade.attachObservable(obj, property, new Computed(definition, defer, undefined, setter), true);
    }

    // TODO: Remove Proxy check
    /**
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableArray<T>(obj: any, property: string, value?: Array<T>) {
        Cascade.attachObservable<Array<T>>(obj, property, Cascade.proxyAvailable ? new ObservableArrayLegacy(value) : new ObservableArray(value));
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableHash<T>(obj: any, property: string, value?: IHash<T>) {
        Cascade.attachObservable<IHash<T>>(obj, property, new ObservableHash(value));
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param subscriberFunction 
     */
    static subscribe<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribe(property, subscriberFunction);
        }
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param subscriberFunction 
     */
    static subscribeOnly<T>(obj: any, property: string, subscriberFunction: ISubscriberFunction<T>) {
        var graph: Graph = obj._graph;
        if (graph) {
            graph.subscribeOnly(property, subscriberFunction);
        }
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static peek(obj: any, property: string) {
        return obj._graph ? (obj._graph as Graph).peek(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
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

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getObservable(obj: any, property: string) {
        var graph: Graph = obj._graph;
        return graph ? graph.observables[property] : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getSubscribers(obj: any, property: string) {
        var graph: Graph = obj._graph;
        return graph ? graph.getSubscribers(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getReferences(obj: any, property: string) {
        var graph: Graph = obj._graph;
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
            var component = new type(props, ...children);
            component.init();
            return component;
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>, callback?: (n: Node) => void, reRender?: (n: any) => void) {
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
        if (callback) {
            callback(renderedComponent);
        }
        Cascade.subscribe(virtualNode, 'root', function (root: any) {
            if (reRender) {
                reRender(root);
            }
        });
    }

    static proxyAvailable: boolean = typeof Proxy !== 'undefined';
    static reflectAvailable: boolean = (typeof Reflect === 'object' && typeof Reflect.getMetadata === 'function');
}