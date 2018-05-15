export interface IPublishCallback {
    (): void;
}

export interface ISubscriber {
    notify(callbacks?: IPublishCallback | IPublishCallback[]): void;
    dispose(recursive?: boolean): void;
}

export interface ISubscriberFunction<T> {
    (n: T, o?: T): void;
}

export interface IObservable<T> {
    id: number;
    subscribers: (ISubscriber | ISubscriberFunction<T>)[];
    getValue(): T;
    peek(): T;
    peekDirty(): T;
    setValue(value: T, callback?: IPublishCallback): void;
    setValueAsync(value: T): Promise<void>;
    subscribeOnly(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    subscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    unsubscribe(subscriber: ISubscriber | ISubscriberFunction<T>): void;
    publish(value: T, oldValue?: T, callbacks?: IPublishCallback | IPublishCallback[]): void;
    dispose(recursive?: boolean): void;
}

export interface IArray<T> extends Array<T> {
    set?: (index: number, value: T) => void;
}

export interface IHash<T> {
    [index: string]: T;
}