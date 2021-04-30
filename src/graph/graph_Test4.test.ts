import { observable } from '../cascade/Decorators';

class ViewModel {
    runsAB = 0;
    runsABC = 0;
    @observable a = 1;
    @observable b = 2;
    @observable c = 3;
    @observable get ab() {
        this.runsAB++;
        return this.a + this.b;
    }
    @observable get abc() {
        this.runsABC++;
        return this.ab + this.c;
    }
}

describe('Graph.pull', function () {
    it('should push changes after pull', function () {
        var model: any = new ViewModel();
        model._graph.subscribe('abc', function () {
            if (complete) {
                expect(ab).toBe(13);
                expect(model.runsAB).toBe(2);
                expect(model.runsABC).toBe(2);
            }
        });
        var complete = false;
        model.a = 11;
        var ab = model.ab;
        var complete = true;
    });
});
