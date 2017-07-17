declare var Proxy: any;

import Observable from './Observable';

export interface IHash<T> {
    [index: string]: T;
}

export default class ObservableHash<T> extends Observable<IHash<T>> {
    constructor(base?: IHash<T>) {
        super(new Proxy((base instanceof Object) ? base : [], {
            set: (target: IHash<T>, property: string, value: T) => {
                target[property] = value;
                this.publish(target, target);
                return true;
            }
        }));
    }
}