declare var Proxy: any;

import Observable from './Observable';
import { IHash } from './IObservable';

export default class ObservableHash<T> extends Observable<IHash<T>> {
    private _innerValue: IHash<T>;

    constructor(value?: IHash<T>) {
        super();
        this._innerValue = value;
        this.value = this.wrapHash((value instanceof Object) ? value : {});
    }

    wrapHash(value: IHash<T>) {
        return new ProxyHash(
            (value instanceof ProxyHash) ?
                Object.assign({}, value) :
                value,
            this
        );
    }

    async setValue(value?: IHash<T>) {
        if (this._innerValue !== value || this.alwaysNotify) {
            this._innerValue = value;
            var oldValue = this.value;
            value = this.wrapHash((value instanceof Object) ? value : {});
            this.value = value;
            this.promise = this.publish(value, oldValue);
            await this.promise;
        }
    }
}

export class ProxyHash<T> implements IHash<T> {
    [index: string]: T;

    constructor(value?: IHash<T>, containingObservable?: Observable<IHash<T>>) {
        let inner = new Proxy(value, {
            set: (target: IHash<T>, property: string, value: T, receiver: ProxyHash<T>) => {
                let result = true;
                let oldValue = target[property];
                if (oldValue !== value || containingObservable.alwaysNotify) {
                    result = (target[property] = value) === value;
                    if (result) {
                        containingObservable.publish(target, target);
                    }
                }
                return result;
            },
            deleteProperty: (target: IHash<T>, property: string) => {
                let result = delete target[property];
                if (result) {
                    containingObservable.publish(target, target);
                }
                return result;
            }
        }) as ProxyHash<T>;
        return inner;
    }
}