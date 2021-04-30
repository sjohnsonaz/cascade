export interface ISubscriber {
    notify(): Promise<void>;
    dispose(recursive?: boolean): void;
}

export interface ISubscriberFunction<T> {
    (n: T, o?: T): void;
}

export interface IObservable<T> {
    id: number;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];
    value: T;
    alwaysNotify: boolean;
    getValue(): T;
    peek(): T;
    peekDirty(): T;
    track(): Promise<void>;
    setValue(value: T): Promise<void>;
    subscribeOnly(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    subscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    unsubscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    publish(value: T, oldValue?: T): Promise<void>;
    dispose(recursive?: boolean): void;
}

export interface IArray<T> extends Array<T> {
    set?: (index: number, value: T) => void;
}

export interface IHash<T> {
    [index: string]: T;
}