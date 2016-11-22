import {IObservable, ISubscriber} from './IObservable';
import Observable from './Observable';
import ComputedQueue from './ComputedQueue';

export default class Computed<T> extends Observable<T> implements ISubscriber {

    id: number;
    references: IObservable<any>[];
    definition: (n: T) => T;
    thisArg: any;
    dirty: boolean;
    disposed: boolean;
    error: Error;

    static id: number = 0;
    static computedQueue: ComputedQueue = new ComputedQueue();

    // TODO: Add alwaysNotify, alwaysUpdate, validation.
    constructor(definition: (n: T) => T, defer: boolean = false, thisArg?: any) {
        super(undefined);
        this.id = Computed.id;
        Computed.id++;

        this.references = [];
        this.definition = definition;
        this.thisArg = thisArg;
        if (defer) {
            this.dirty = true;
        } else {
            this.runDefinition(definition);
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
    peek() {
        if (this.dirty) {
            this.runUpdate();
        }
        return this.value;
    }
    setValue(value: T) { }
    notify() {
        if (!this.disposed) {
            this.notifyDirty();
            if (Computed.computedQueue.completed) {
                Computed.computedQueue = new ComputedQueue();
            }
            Computed.computedQueue.add(this);
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
    runUpdate() {
        if (!this.disposed && this.dirty) {
            var value = this.value;
            this.runDefinition(this.definition);
            this.dirty = false;
            if (this.value !== value) {
                this.publish(this.value, value);
            }
        }
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
            this.value = output;

            //TODO: Prevent redundant subscription.
            for (var index = 0, length: number = context.length; index < length; index++) {
                var reference = context[index];
                reference.subscribeOnly(this);
            }
            this.references = context;
        }
        // TODO: Should we rethrow
        /*
        else {
            throw this.error;
        }
        */
    }
    dispose() {
        this.disposed = true;
        for (var index = 0, length = this.references.length; index < length; index++) {
            var reference = this.references[index];
            reference.unsubscribe(this);
        }
    }
}
