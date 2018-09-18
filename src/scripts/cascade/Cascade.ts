import Graph from '../graph/Graph';
import { IObservable, ISubscriber, ISubscriberFunction, IArray, IHash } from '../graph/IObservable';
import Observable from '../graph/Observable';
import Computed from '../graph/Computed';
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
    static disposeAll<T>(obj: T) {
        var graph: Graph<T> = obj['_graph'];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                // Only dispose non-observable properties here.
                if (!graph || !graph.observables[name]) {
                    Cascade.disposeAll(obj[name] as any);
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
    static attachGraph<T>(obj: T) {
        if (!(obj as any)._graph) {
            Object.defineProperty(obj, '_graph', {
                configurable: true,
                writable: true,
                enumerable: false,
                value: new Graph(obj)
            });
        }
        return (obj as any)._graph as Graph<T>;
    }

    /**
     * 
     * @param obj the object on which to define a property
     * @param property the name of the property
     * @param observable the IObservable to store the property value
     */
    static createProperty<T, U extends keyof T>(obj: T, property: U, observable: IObservable<T[U]>) {
        var graph = Cascade.attachGraph(obj);
        if (graph.observables[property as string]) {
            // TODO: move or delete subscriptions?
            observable.subscribers = graph.observables[property as string].subscribers;
        }
        graph.observables[property as string] = observable;
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

    /**
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableArray<T, U extends keyof T>(obj: T, property: U, value?: T[U]) {
        Cascade.attachObservable<T, U>(obj, property, new ObservableArray<any>(value as any) as any);
    }

    /** 
     * 
     * @param obj 
     * @param property 
     * @param value 
     */
    static createObservableHash<T, U extends keyof T>(obj: T, property: U, value?: T[U]) {
        Cascade.attachObservable<T, U>(obj, property, new ObservableHash<T[U]>(value as any) as any);
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param alwaysNotify 
     */
    static setAlwaysNotify<T, U extends keyof T>(obj: T, property: U, alwaysNotify: boolean) {
        let graph = this.attachGraph(obj);
        graph.setAlwaysNotify(property, alwaysNotify);
    }

    /**
     * 
     * @param obj 
     * @param property 
     * @param subscriberFunction 
     */
    static subscribe<T, U extends keyof T>(obj: T, property: U, subscriberFunction: ISubscriberFunction<T[U]>, createDisposer: boolean = false) {
        let graph = this.attachGraph(obj);
        graph.subscribe(property, subscriberFunction);
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
    static subscribeOnly<T, U extends keyof T>(obj: T, property: U, subscriberFunction: ISubscriberFunction<T[U]>, createDisposer: boolean = false) {
        let graph = this.attachGraph(obj);
        graph.subscribeOnly(property, subscriberFunction);
        return createDisposer ? function () {
            graph.unsubscribe(property, subscriberFunction);
        } : undefined;
    }

    static unsubscribe<T, U extends keyof T>(obj: T, property: U, subscriberFunction: ISubscriberFunction<T[U]>) {
        var graph: Graph<T> = obj['_graph'];
        if (graph) {
            graph.unsubscribe(property, subscriberFunction);
        }
    }

    static waitToEqual<T, U extends keyof T>(obj: T, property: U, testValue: T[U], timeout?: number) {
        let graph = this.attachGraph(obj);
        return new Promise<T[U]>((resolve, reject) => {
            let resolved = false;
            let subscriberFunction = (value: T[U]) => {
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
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static peek<T, U extends keyof T>(obj: T, property: U) {
        return obj['_graph'] ? (obj['_graph'] as Graph<T>).peek<U>(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static peekDirty<T, U extends keyof T>(obj: T, property: U) {
        return obj['_graph'] ? (obj['_graph'] as Graph<T>).peekDirty<U>(property) : undefined;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static track<T, U extends keyof T>(obj: T, property: U) {
        let graph = this.attachGraph(obj);
        let observable = graph.observables[property as string] as IObservable<T[U]>;
        if (observable) {
            return observable.track();
        } else {
            throw new Error('No observable attached to Object: ' + property);
        }
    }

    /**
     * 
     * @param obj 
     */
    static trackAll<T>(obj: T) {
        let graph = this.attachGraph(obj);
        return graph.trackAll();
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static update<T, U extends keyof T>(obj: T, property: U) {
        let graph = this.attachGraph(obj);
        let observable = graph.observables[property as string] as Computed<T[U]>;
        if (observable && observable.update) {
            return observable.update();
        } else {
            throw new Error('No observable attached to Object: ' + property);
        }
    }

    static set<T, U extends keyof T>(obj: T, property: U, value: T[U]) {
        let graph = this.attachGraph(obj);
        let observable = graph.observables[property as string] as IObservable<T[U]>;
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
        let graph = this.attachGraph(obj);
        let observable = graph.observables[property as string] as IObservable<T[U]>;
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
        let graph = this.attachGraph(obj);
        return graph.observables[property as string] as IObservable<T[U]>;
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getSubscribers<T, U extends keyof T>(obj: T, property: U) {
        let graph = this.attachGraph(obj);
        return graph.getSubscribers<U>(property);
    }

    /**
     * 
     * @param obj 
     * @param property 
     */
    static getReferences<T, U extends keyof T>(obj: T, property: U) {
        let graph = this.attachGraph(obj);
        return graph.getReferences(property);
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

    static createElement<T extends IVirtualNodeProps>(type: string | (new (props: T, children: Array<any>) => Component<T>), props: T, ...children: Array<any>): IVirtualNode<T> {
        if (typeof type === 'string') {
            return new VirtualNode(type, props, children);
        } else {
            return new ComponentNode(type, props, children);
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

    static reflectAvailable: boolean = (typeof Reflect === 'object' && typeof Reflect.getMetadata === 'function');
}