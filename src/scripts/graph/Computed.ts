import Observable, {Subscriber} from './Observable';
import ComputedQueue from './ComputedQueue';

var id: number = 0;
var computedQueue: ComputedQueue = new ComputedQueue();

export default class Computed<T> extends Observable<T> implements Subscriber {

    id: number;
    references: Observable<any>[];
    definition: (n: T) => T;
    thisArg: any;
    dirty: boolean;
    error: Error;

    // TODO: Add alwaysNotify, alwaysUpdate, validation.
    constructor(definition: (n: T) => T, defer: boolean = false, thisArg?: any) {
        super(undefined);
        this.id = id;
        id++;

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
        this.notifyDirty();
        if (computedQueue.completed) {
            computedQueue = new ComputedQueue();
        }
        computedQueue.add(this);
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
        if (this.dirty) {
            var value = this.value;
            this.runDefinition(this.definition);
            this.dirty = false;
            if (this.value !== value) {
                this.publish();
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
        for (var index = 0, length = this.references.length; index < length; index++) {
            var reference = this.references[index];
            reference.unsubscribe(this);
        }
    }
}
