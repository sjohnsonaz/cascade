import Graph from '../graph/Graph';
import { IObservable } from '../graph/IObservable';

export default class DecoratorUtil {
    static createObservableIfNotExists<T>(obj: any, property: string, factory: (value?: T) => IObservable<T>, value?: T, set?: boolean): IObservable<T> {
        Graph.attachGraph(obj);
        if (!obj._graph.observables[property]) {
            obj._graph.observables[property] = factory(value);
        } else if (set) {
            obj._graph.observables[property].setValue(value);
        }
        return obj._graph.observables[property];
    }

    static attachObservable<T>(target: any, propertyKey: string, factory: (value?: T) => IObservable<T>) {
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            configurable: true,
            get: function () {
                return DecoratorUtil.createObservableIfNotExists(this, propertyKey, factory).getValue();
            },
            set: function (value: T) {
                DecoratorUtil.createObservableIfNotExists(this, propertyKey, factory, value, true);
            }
        });
    }
}