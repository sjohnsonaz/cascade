import Cascade from './Cascade';
import Observable from '../graph/Observable';
import ObservableArray from '../graph/ObservableArray';
import ObservableHash from '../graph/ObservableHash';
import Computed from '../graph/Computed';
import { IHash } from '../graph/IObservable';

function createObservableIfNotExists<T>(obj: any, property: string, value?: T, set?: boolean): Observable<T> {
    Cascade.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new Observable<T>(value);
    } else if (set) {
        obj._graph.observables[property].setValue(value);
    }
    return obj._graph.observables[property];
}

function createArrayIfNotExists<T>(obj: any, property: string, value?: Array<T>, set?: boolean): ObservableArray<T> {
    Cascade.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new ObservableArray<T>(value);
    } else if (set) {
        obj._graph.observables[property].setValue(value);
    }
    return obj._graph.observables[property];
}

function createHashIfNotExists<T>(obj: any, property: string, value?: IHash<T>, set?: boolean): ObservableHash<T> {
    Cascade.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new ObservableHash<T>(value);
    } else if (set) {
        obj._graph.observables[property].setValue(value);
    }
    return obj._graph.observables[property];
}

function createComputedIfNotExists<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean, thisArg?: any, setter?: (n?: T) => any): Computed<T> {
    Cascade.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new Computed<T>(definition, defer, thisArg, setter);
    }
    return obj._graph.observables[property];
}

function attachObservable<T>(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function () {
            return createObservableIfNotExists(this, propertyKey).getValue();
        },
        set: function (value: T) {
            createObservableIfNotExists(this, propertyKey, value, true);
        }
    });
}

export function array<T>(target: any, propertyKey: string): any {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function () {
            return createArrayIfNotExists(this, propertyKey).getValue();
        },
        set: function (value: Array<T>) {
            createArrayIfNotExists(this, propertyKey, value, true);
        }
    });
}

export function hash<T>(target: any, propertyKey: string): any {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function () {
            return createHashIfNotExists(this, propertyKey).getValue();
        },
        set: function (value: IHash<T>) {
            createHashIfNotExists(this, propertyKey, value, true);
        }
    });
}

function attachComputed<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>, definition?: (n?: T) => T, setter?: (n: T) => any) {
    descriptor = descriptor || {};
    definition = definition || descriptor.get;
    descriptor.enumerable = true;
    descriptor.get = function () {
        return createComputedIfNotExists(this, propertyKey, definition, false, this, setter).getValue();
    }
    return descriptor;
}

// TODO: Remove Reflect check
export function observable<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
    if (descriptor) {
        attachComputed(target, propertyKey, descriptor);
    } else {
        // Only use Reflection if it exists.
        if (Cascade.reflectAvailable) {
            var type = Reflect.getMetadata("design:type", target, propertyKey);
        }
        if (type === Array) {
            array(target, propertyKey);
        } else {
            attachObservable(target, propertyKey);
        }
    }
}

export function computed<T>(definition: (n?: T) => T, setter?: (n: T) => any) {
    return function (target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
        return attachComputed(target, propertyKey, descriptor, definition, setter);
    }
}
