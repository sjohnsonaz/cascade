import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

var runsParent = 0;
var runsChild = 0;
var childObservable = undefined;
var childStatic = undefined;

class Child {
    parent: Parent;
    @observable c = 1;
    @observable d = 2;
    @observable get abcd() {
        runsChild++;
        return this.parent.a + this.parent.b + this.c + this.d;
    }
    constructor(parent: Parent) {
        Object.defineProperty(this, 'parent', {
            writable: true,
            configurable: true,
            enumerable: false,
        });
        this.parent = parent;
        var abcd = this.abcd;
    }
}

class Parent {
    @observable a = 1;
    @observable b = 2;
    @observable get ab() {
        runsParent++;
        return this.a + this.b;
    }
    @observable childObservable: Child;
    childStatic: Child;
    constructor() {
        var ab = this.ab;
        childObservable = new Child(this);
        childStatic = new Child(this);
        this.childObservable = childObservable;
        this.childStatic = childStatic;
    }
}

describe('Graph.dispose', function () {
    it('should dispose observables recursively', function () {
        var model: any = new Parent();
        Cascade.disposeAll(model);
        expect(model._graph.observables.a.subscribers.length).toBe(0);
        expect(model._graph.observables.b.subscribers.length).toBe(0);
        expect(runsParent).toBe(1);
        expect(runsChild).toBe(2);
    });
});
