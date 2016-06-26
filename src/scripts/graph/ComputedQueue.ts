export default class ComputedQueue {
    items: Array<any>
    hash: Object;
    scheduled: boolean;
    completed: boolean;

    constructor() {
        this.items = [];
        this.hash = {};
        this.scheduled = false;
        this.completed = false;
    }

    add(computed) {
        if (!this.hash[computed.id]) {
            this.hash[computed.id] = computed;
            this.items.push(computed);
            if (!this.scheduled) {
                this.scheduled = true;
                window.setTimeout(this.run, 1, this);
            }
        }
    }

    run(self) {
        self.completed = true;
        for (var index = 0, length = self.items.length; index < length; index++) {
            var computed = self.items[index];
            computed.runUpdate();
        }
    }
}