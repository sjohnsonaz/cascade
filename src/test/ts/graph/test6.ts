import TestRunner from '../TestRunner';
import Cascade from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'Observables may be disposed recursively.',
    test: function (input, callback) {
        var runsParent = 0;
        var runsChild = 0;
        var childObservable = undefined;
        var childStatic = undefined;

        function Parent() {
            var self = this;
            Cascade.createObservable(this, 'a', 1);
            Cascade.createObservable(this, 'b', 2);
            Cascade.createComputed(this, 'ab', function () {
                runsParent++;
                return self.a + self.b;
            });
            childObservable = new Child(this);
            childStatic = new Child(this);
            Cascade.createObservable(this, 'childObservable', childObservable);
            this.childStatic = childStatic;
        }

        function Child(parent) {
            var self = this;
            Cascade.createObservable(this, 'c', 1);
            Cascade.createObservable(this, 'd', 2);
            Cascade.createComputed(this, 'abcd', function () {
                runsChild++;
                return parent.a + parent.b + self.c + self.d;
            });
        }

        var model = new Parent();

        Cascade.disposeAll(model);
        callback({
            a: model._graph.observables.a.subscribers.length,
            b: model._graph.observables.b.subscribers.length,
            runsParent: runsParent,
            runsChild: runsChild
        });
    },
    assert: function (result, callback) {
        callback(result.a == 0 && result.b == 0 && result.runsParent == 1, result.runsChild == 2);
    }
});
