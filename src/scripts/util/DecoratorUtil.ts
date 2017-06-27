import Graph from '../graph/Graph';
import { IObservable } from '../graph/IObservable';
import Computed from '../graph/Computed';

type ObservableFactory<T> = {
    (value: T, thisArg: any): IObservable<T>;
}
export default class DecoratorUtil {
    static createObservableIfNotExists<T>(obj: any, property: string, factory: ObservableFactory<T>, value?: T, set?: boolean, thisArg?: any): IObservable<T> {
        Graph.attachGraph(obj);
        if (!obj._graph.observables[property]) {
            obj._graph.observables[property] = factory(value, thisArg);
        } else if (set) {
            obj._graph.observables[property].setValue(value);
        }
        return obj._graph.observables[property];
    }

    static attachObservable<T>(target: any, propertyKey: string, factory: ObservableFactory<T>, readOnly: boolean = false) {
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            configurable: true,
            get: function () {
                return DecoratorUtil.createObservableIfNotExists(this, propertyKey, factory, undefined, false, this).getValue();
            },
            set: readOnly ? undefined : function (value: T) {
                DecoratorUtil.createObservableIfNotExists(this, propertyKey, factory, value, true, this);
            }
        });
    }
}

export function minLength(length: number = 0): any {
    return function minLength(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<boolean>): any {
        DecoratorUtil.attachObservable<boolean>(target, propertyKey + '_minLength', (value: boolean, thisArg: any) => {
            return new Computed<boolean>(function () {
                return target[propertyKey].length >= length;
            }, false, thisArg);
        }, true);
    }
}