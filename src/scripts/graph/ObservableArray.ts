declare var Proxy: any;

import Observable from './Observable';

export default class ObservableArray<T> extends Observable<Array<T>> {
    constructor(value?: Array<T>) {
        super();
        this.value = this.wrapArray((value instanceof Array) ? value : []);
    }

    wrapArray(value: Array<T>) {
        return new Proxy(value, {
            set: (target: Array<T>, property: string, value: T) => {
                target[property] = value;
                if (isFinite(Number(property))) {
                    this.publish(target, target);
                }
                return true;
            }
        });
    }

    setValue(value?: Array<T>) {
        if (this.value !== value) {
            var oldValue = this.value;
            value = this.wrapArray((value instanceof Array) ? value : []);
            this.value = value;
            this.publish(value, oldValue);
        }
    }

    // TODO: This is included to be compatible with ObservableArrayLegacy.
    set(index: number, value: T) {
        this.value[index] = value;
    }
}