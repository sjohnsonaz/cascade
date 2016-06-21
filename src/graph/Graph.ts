import Observable from './Observable';
import Computed from './Computed';

export default class Graph {
    observables: Object;

    constructor() {
        this.observables = {};
    }

    peekValue(obj, property) {
        return obj.observables[property].value;
    }

    dispose() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                this.observables[index].dispose();
            }
        }
    }

    disposeAll() {
        for (var index in this.observables) {
            if (this.observables.hasOwnProperty(index)) {
                var observable = this.observables[index];
                if (observable.value && observable.value._graph) {
                    observable.value._graph.disposeAll();
                }
                observable.dispose();
            }
        }
    }
}
