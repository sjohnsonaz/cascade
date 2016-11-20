import Graph from './Graph';
import Observable from './Observable';
import ObservableArray from './ObservableArray';
import Computed from './Computed';

function createObservableIfNotExists<T>(obj: any, property: string, value?: T, set?: boolean): Observable<T> {
    Graph.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new Observable<T>(value);
    } else if (set) {
        obj._graph.observables[property].setValue(value);
    }
    return obj._graph.observables[property];
}

function createArrayIfNotExists<T>(obj: any, property: string, value?: Array<T>, set?: boolean): ObservableArray<T> {
    Graph.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new ObservableArray<T>(value);
    } else if (set) {
        obj._graph.observables[property].setValue(value);
    }
    return obj._graph.observables[property];
}

function createComputedIfNotExists<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean, thisArg?: any): Computed<T> {
    Graph.attachGraph(obj);
    if (!obj._graph.observables[property]) {
        obj._graph.observables[property] = new Computed<T>(definition, defer, thisArg);
    }
    return obj._graph.observables[property];
}

function attachObservable<T>(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function() {
            return createObservableIfNotExists(this, propertyKey).getValue();
        },
        set: function(value: T) {
            createObservableIfNotExists(this, propertyKey, value, true);
        }
    });
}

export function array<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
    Object.defineProperty(target, propertyKey, {
        enumerable: true,
        configurable: true,
        get: function() {
            return createArrayIfNotExists(this, propertyKey).getValue();
        },
        set: function(value: Array<T>) {
            createArrayIfNotExists(this, propertyKey, value, true);
        }
    });
}

function attachComputed<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>, definition?: (n: T) => T) {
    descriptor = descriptor || {};
    definition = definition || descriptor.get;
    descriptor.enumerable = true;
    descriptor.get = function() {
        return createComputedIfNotExists(this, propertyKey, definition, false, this).getValue();
    }
    return descriptor;
}

export function observable<T>(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
    if (descriptor) {
        attachComputed(target, propertyKey, descriptor);
    } else {
        // Only use Reflection if it exists.
        if (typeof Reflect === 'object' && typeof Reflect.getMetadata === "function") {
            var type = Reflect.getMetadata("design:type", target, propertyKey);
        }
        if (type === Array) {
            array(target, propertyKey, descriptor);
        } else {
            attachObservable(target, propertyKey);
        }
    }
}

export function computed<T>(definition: (n: T) => T) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): any {
        return attachComputed(target, propertyKey, descriptor, definition);
    }
}
