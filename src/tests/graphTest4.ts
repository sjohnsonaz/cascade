import { expect } from 'chai';

import { observable } from '../scripts/modules/Cascade';

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
        model._graph.subscribe('abc', function (value) {
            if (complete) {
                expect(ab).to.equal(13);
                expect(model.runsAB).to.equal(2);
                expect(model.runsABC).to.equal(2);
            }
        });
        var complete = false
        model.a = 11;
        var ab = model.ab;
        var complete = true;
    });
});
