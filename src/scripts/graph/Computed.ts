import { IObservable, ISubscriber } from './IObservable';
import Observable from './Observable';
import ComputedQueue from './ComputedQueue';

export default class Computed<T> extends Observable<T> implements ISubscriber {

    references: IObservable<any>[];
    definition: (n?: T) => T;
    setter: (n: T) => any;
    thisArg: any;
    dirty: boolean;
    disposed: boolean;
    error: Error;

    constructor(definition: (n?: T) => T, defer: boolean = false, thisArg?: any, setter?: (n: T) => any) {
        super(undefined);
        this.references = [];
        this.definition = definition;
        this.thisArg = thisArg;
        this.setter = setter;
        if (defer) {
            this.dirty = true;
        } else {
            this.value = this.runDefinition(definition);
            this.dirty = false;
        }
    }

    getValue() {
        super.getValue();
        if (this.dirty) {
            this.runUpdate();
        }
        return this.value;
    }

    update() {
        this.dirty = true;
        return this.getValue();
    }

    peek() {
        if (this.dirty) {
            this.runUpdate();
        }
        return this.value;
    }

    peekDirty() {
        return this.value;
    }

    setValue(value: T) {
        if (this.setter) {
            let newValue = this.setter(value);
            if (this.value !== newValue || this.alwaysNotify) {
                var oldValue = this.value;
                this.value = newValue;
                return this.publish(newValue, oldValue);
            } else {
                return Promise.resolve();
            }
        } else {
            return Promise.resolve();
        }
    }

    notify() {
        if (!this.disposed) {
            this.notifyDirty();
            if (ComputedQueue.computedQueue.completed) {
                ComputedQueue.computedQueue = new ComputedQueue();
            }
            return ComputedQueue.computedQueue.add(this);
        } else {
            return Promise.resolve();
        }
    }

    notifyDirty() {
        if (!this.dirty) {
            this.dirty = true;
            for (var index = 0, length = this.subscribers.length; index < length; index++) {
                var subscriber = this.subscribers[index];
                if (subscriber instanceof Computed) {
                    subscriber.notifyDirty();
                }
            }
        }
    }

    async runUpdate() {
        if (!this.disposed && this.dirty) {
            var value = this.value;
            this.value = this.runDefinition(this.definition);
            this.dirty = false;
            if (this.value !== value || this.alwaysNotify) {
                await this.publish(this.value, value);
            }
        }
        return this.value;
    }

    runOnly() {
        this.value = this.runDefinition(this.definition);
        this.dirty = false;
        return this.value;
    }

    runDefinition(definition: (n: T) => T) {
        //TODO: Reduce unsubscribe calls.
        for (var index = 0, length: number = this.references.length; index < length; index++) {
            var reference = this.references[index];
            reference.unsubscribe(this);
        }

        Observable.pushContext();
        this.error = undefined;
        try {
            var output: T;
            if (this.thisArg) {
                output = definition.call(this.thisArg, this.value);
            } else {
                output = definition(this.value);
            }
        } catch (e) {
            this.error = e;
            console.error(e);
        }
        var context = Observable.popContext();
        if (!this.error) {
            //TODO: Use non-hash method to prevent redundant subscriptions.
            let hash: {
                [index: string]: IObservable<any>;
            } = {};
            let references: IObservable<any>[] = [];
            for (var index = 0, length: number = context.length; index < length; index++) {
                var reference = context[index];
                if (!hash[reference.id]) {
                    hash[reference.id] = reference;
                    references.push(reference);
                    reference.subscribeOnly(this);
                }
            }
            this.references = references;
        }
        return output;
    }

    dispose(recursive?: boolean) {
        super.dispose(recursive);
        this.disposed = true;
        if (recursive) {
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.dispose(true);
            }
        } else {
            for (var index = 0, length = this.references.length; index < length; index++) {
                var reference = this.references[index];
                reference.unsubscribe(this);
            }
        }
    }
}
