declare var Proxy: any;

import Observable from './Observable';
import { IArray } from './IObservable';

export default class ObservableArray<T> extends Observable<IArray<T>> {
    constructor(value?: Array<T>) {
        super();
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

    setValue(value?: Array<T>) {
        if (this.value !== value) {
            var oldValue = this.value;
            value = this.wrapArray((value instanceof Array) ? value : []);
            this.value = value;
            this.publish(value, oldValue);
        }
    }
}

export class ProxyArray<T> extends Array<T> implements IArray<T> {
    private _containingObservable?: Observable<IArray<T>>;

    constructor(value?: Array<T>, containingObservable?: Observable<Array<T>>) {
        super();
        (value as IArray<T>).set = ProxyArray.prototype.set;
        let inner = new Proxy(value, {
            set: (target: Array<T>, property: string, value: T, receiver: ProxyArray<T>) => {
                target[property] = value;
                if (isFinite(Number(property))) {
                    receiver._containingObservable.publish(target, target);
                }
                return true;
            }
        }) as ProxyArray<T>;
        inner._containingObservable = containingObservable;
        return inner;
    }

    // TODO: This is included to be compatible with ObservableArrayLegacy.
    set(index: number, value: T) {
        this[index] = value;
    }
}