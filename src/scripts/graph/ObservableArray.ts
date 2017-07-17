declare var Proxy: any;

import Observable from './Observable';

export default class ObservableArray<T> extends Observable<Array<T>> {
    constructor(base?: Array<T>) {
        super(new Proxy((base instanceof Array) ? base : [], {
            set: (target: Array<T>, property: string, value: T) => {
                target[property] = value;
                if (isFinite(Number(property))) {
                    this.publish(target, target);
                }
                return true;
            }
        }));
    }

    // TODO: This is included to be compatible with ObservableArrayLegacy.
    set(index: number, value: T) {
        this.value[index] = value;
    }
}