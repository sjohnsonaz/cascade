export interface ISubscriber {
    notify(): void;
}

export interface ISubscriberFunction<T> {
    (n: T, o?: T): void
}

export interface IObservable<T> {
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];
    getValue(): T;
    peek(): T;
    setValue(value: T): void;
    subscribeOnly(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    subscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    unsubscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    publish(value: T, oldValue?: T): void;
    dispose(): void;
}

export interface IArray<T> extends Array<T> {
    set?: (index: number, value: T) => void;
}

export interface IHash<T> {
    [index: string]: T;
}
