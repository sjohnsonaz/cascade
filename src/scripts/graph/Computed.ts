import Observable from './Observable';
import ComputedQueue from './ComputedQueue';

var id: number = 0;
var computedQueue: ComputedQueue = new ComputedQueue();

export default class Computed extends Observable {

    id: number;
    references: Array<any>;
    definition: Function;
    dirty: boolean;
    error: Error;

    // TODO: Add alwaysNotify, alwaysUpdate, validation.
    constructor(definition: Function, defer: boolean = false) {
        super(undefined);
        this.id = id;
        id++;

        this.references = [];
        this.definition = definition;
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
    setValue(value) { }
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
    runDefinition(definition) {
        //TODO: Reduce unsubscribe calls.
        for (var index = 0, length: number = this.references.length; index < length; index++) {
            var reference = this.references[index];
            reference.unsubscribe(this);
        }

        Observable.pushContext();
        this.error = undefined;
        try {
            var output = definition(this.value);
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
    }
    dispose() {
        for (var index = 0, length = this.references.length; index < length; index++) {
            var reference = this.references[index];
            reference.unsubscribe(this);
        }
    }
}