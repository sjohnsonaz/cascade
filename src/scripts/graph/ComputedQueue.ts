import Computed from './Computed';

export interface ComputedHash {
    [index: string]: Computed<any>;
}

export default class ComputedQueue {
    items: Computed<any>[];
    hash: ComputedHash;
    scheduled: boolean;
    completed: boolean;

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
                // TODO: Remove bind.  This is for IE9.
                window.setTimeout(this.run.bind(this, this), 0, this);
            }
        }
    }

    run(self: ComputedQueue) {
        self.completed = true;
        for (var index = 0, length = self.items.length; index < length; index++) {
            var computed = self.items[index];
            computed.runUpdate();
        }
    }
}
