import { expect } from 'chai';

import { observable } from '../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable a: number = 1;
    @observable b: number = 2;
    @observable c: number = 3;
    @observable d: number = 4;
    @observable get ab() {
        return this.a + this.b;
    }
    @observable get ac() {
        return this.a + this.c;
    }
    @observable get ad() {
        return this.a + this.d;
    }
    @observable get bc() {
        return this.b + this.c;
    }
    @observable get bd() {
        return this.b + this.d;
    }
    @observable get cd() {
        return this.c + this.d;
    }
    @observable get abcd() {
        return this.ab + this.ac + this.ad + this.bc + this.bd + this.cd;
    }
}

describe('Graph', function () {
    it('should have minimal computed updates', function () {
        var viewModel: any = new ViewModel();
        var complete = false;
        viewModel._graph.subscribe('abcd', function (value: number) {
            viewModel.runs++;
            if (complete) {
                expect(value).to.equal(150);
                expect(viewModel.runs).to.equal(2);
            }
        });
        viewModel.a = 11;
        viewModel.b = 12;
        viewModel.c = 13;
        viewModel.d = 14;
        complete = true;
    });
});
