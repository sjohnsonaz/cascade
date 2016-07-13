import TestRunner from '../TestRunner';
import Cascade, {observable} from '../../../scripts/modules/Cascade';

var runsParent = 0;
var runsChild = 0;
var childObservable = undefined;
var childStatic = undefined;

class Parent {
    @observable a = 1;
    @observable b = 2;
    @observable get ab() {
        runsParent++;
        return this.a + this.b;
    }
    @observable childObservable;
    childStatic;
    constructor() {
        var ab = this.ab;
        childObservable = new Child(this);
        childStatic = new Child(this);
        this.childObservable = childObservable;
        this.childStatic = childStatic;
    }
}

class Child {
    parent;
    @observable c = 1;
    @observable d = 2;
    @observable get abcd() {
        runsChild++;
        return this.parent.a + this.parent.b + this.c + this.d;
    }
    constructor(parent) {
        Object.defineProperty(this, 'parent', {
            writable: true,
            configurable: true,
            enumerable: false
        });
        this.parent = parent;
        var abcd = this.abcd;
    }
}

TestRunner.test({
    name: 'Observables may be disposed recursively.',
    test: function(input, callback) {
        var model: any = new Parent();
        Cascade.disposeAll(model);
        callback({
            a: model._graph.observables.a.subscribers.length,
            b: model._graph.observables.b.subscribers.length,
            runsParent: runsParent,
            runsChild: runsChild
        });
    },
    assert: function(result, callback) {
        callback(result.a == 0 && result.b == 0 && result.runsParent == 1, result.runsChild == 2);
    }
});
