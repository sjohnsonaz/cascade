import { expect } from 'chai';

import { observable, array } from '../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable a: number[] = [1, 2, 3, 4];
    @observable get loop() {
        var a = this.a;
        var total = 0;
        for (var index = 0, length = a.length; index < length; index++) {
            total += a[index];
        }
        return total;
    }
}

describe('Graph', function () {
    it('should observe changes to Arrays', function () {
        var viewModel: any = new ViewModel();
        var complete = false;
        viewModel._graph.subscribe('loop', function (value) {
            viewModel.runs++;
            if (complete) {
                expect(value).to.equal(120);
                expect(viewModel.runs).to.equal(2);
            }
        });
        viewModel.a.push(10);
        viewModel.a.push(100);
        complete = true;
    });
});
