declare var Proxy: any;

import Observable from './Observable';
import { IArray } from './IObservable';

export default class ObservableArray<T> extends Observable<IArray<T>> {
    private _innerValue: Array<T>;

    constructor(value?: Array<T>) {
        super();
        this._innerValue = value;
        this.value = this.wrapArray((value instanceof Array) ? value : []);
    }

    wrapArray(value: Array<T>) {
        return new ProxyArray(
            (value instanceof ProxyArray) ?
                value.slice(0) :
                value,
            this
        );
    }

    async setValue(value?: Array<T>) {
        if (this._innerValue !== value || this.alwaysNotify) {
            this._innerValue = value;
            var oldValue = this.value;
            value = this.wrapArray((value instanceof Array) ? value : []);
            this.value = value;
            this.promise = this.publish(value, oldValue);
            await this.promise;
        }
    }
}

export class ProxyArray<T> extends Array<T> implements IArray<T> {
    constructor(value?: Array<T>, containingObservable?: Observable<Array<T>>) {
        super();
        let inner = new Proxy(value, {
            set: (target: Array<T>, property: string, value: T, receiver: ProxyArray<T>) => {
                let result = true;
                let oldValue = target[property];
                if (oldValue !== value || containingObservable.alwaysNotify) {
                    result = (target[property] = value) === value;
                    if (result && isFinite(Number(property)) || property === 'length') {
                        containingObservable.publish(target, target);
                    }
                }
                return result;
            },
            deleteProperty: (target: Array<T>, property: string) => {
                let result = delete target[property];
                if (result && isFinite(Number(property))) {
                    containingObservable.publish(target, target);
                }
                return result;
            }
        }) as ProxyArray<T>;
        return inner;
    }
}