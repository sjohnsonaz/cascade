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
    promise: Promise<void>;

    static computedQueue: ComputedQueue = new ComputedQueue();

    constructor() {
        this.items = [];
        this.hash = {};
        this.scheduled = false;
        this.completed = false;
    }

    add(computed: Computed<any>) {
        if (!this.hash[computed.id]) {
            this.hash[computed.id] = computed;
            this.items.push(computed);
            if (!this.scheduled) {
                this.scheduled = true;
                this.promise = new Promise((resolve) => {
                    window.setTimeout(async () => {
                        this.completed = true;
                        await Promise.all(this.items.map(computed => computed.runUpdate()));
                        resolve();
                    }, 0);
                });
            }
            return this.promise;
        } else {
            return this.promise;
        }
    }
}
