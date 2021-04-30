import Cascade, { IObservable, Computed } from '../modules/Cascade';

export type ObservableFactory<T> = {
    /**
     * @param value
     * @param thisArg 
     */
    (value: T, thisArg: any): IObservable<T>;
}

export default class DecoratorUtil {
    /**
     * Creates a new `IObservable` or returns one if it already exists
     * @param obj 
     * @param property 
     * @param factory 
     * @param value 
     * @param set 
     * @param thisArg 
     */
    static createObservableIfNotExists<T>(obj: any, property: string, factory: ObservableFactory<T>, value?: T, set?: boolean, thisArg?: any): IObservable<T> {
        Cascade.attachGraph(obj);
        if (!obj._graph.observables[property]) {
            obj._graph.observables[property] = factory(value, thisArg);
        } else if (set) {
            obj._graph.observables[property].setValue(value);
        }
        return obj._graph.observables[property];
    }

    /**
     * Attaches a new `IObservable` to the getter and setter of an object.
     * @param target 
     * @param propertyKey 
     * @param factory 
     * @param readOnly 
     */
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