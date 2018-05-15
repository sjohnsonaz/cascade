import { IPublishCallback } from './IObservable';
import Computed from './Computed';
import { wait } from '../util/PromiseUtil';

export interface ComputedHash {
    [index: string]: Computed<any>;
}

export default class ComputedQueue {
    items: Computed<any>[];
    hash: ComputedHash;
    scheduled: boolean;
    completed: boolean;
    callbacks: IPublishCallback[];

    constructor() {
        this.items = [];
        this.hash = {};
        this.scheduled = false;
        this.completed = false;
    }

    async add(computed: Computed<any>, callbacks?: IPublishCallback | IPublishCallback[]) {
        if (!this.hash[computed.id]) {
            this.hash[computed.id] = computed;
            this.items.push(computed);
            if (callbacks) {
                if (!this.callbacks) {
                    if (callbacks instanceof Array) {
                        this.callbacks = callbacks;
                    } else {
                        this.callbacks = [callbacks];
                    }
                } else {
                    if (callbacks instanceof Array) {
                        this.callbacks = this.callbacks.concat(this.callbacks, callbacks);
                    } else {
                        this.callbacks.push(callbacks);
                    }
                }
            }
            if (!this.scheduled) {
                this.scheduled = true;
                // TODO: Remove bind.  This is for IE9.
                window.setTimeout(this.run.bind(this, this), 0, this);
            }
        }
    }

    run(self: ComputedQueue) {
        self.completed = true;
        for (var index = 0, length = self.items.length; index < length; index++) {
            var computed = self.items[index];
            computed.runUpdate(this.callbacks);
        }
    }
}
