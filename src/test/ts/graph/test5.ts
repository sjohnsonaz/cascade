import TestRunner from '../TestRunner';
import {observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs = 0;
    @observable a = 1;
    @observable b = 2;
    @observable get ab() {
        this.runs++;
        return this.a + this.b;
    }
}

TestRunner.test({
    name: 'Observables may be disposed.',
    test: function(input, callback) {
        var model: any = new ViewModel();
        var ab = model.ab;
        model._graph.dispose();
        callback({
            a: model._graph.observables.a.subscribers.length,
            b: model._graph.observables.b.subscribers.length,
            runs: model.runs,
        });
    },
    assert: function(result, callback) {
        callback(result.a == 0 && result.b == 0 && result.runs == 1);
    }
});
