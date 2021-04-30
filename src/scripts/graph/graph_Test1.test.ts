import { observable } from '../cascade/Decorators';

class ViewModel {
    runs: number = 0;
    @observable a: number = 1;
    @observable b: number = 2;
    @observable c: number = 3;
    @observable get ab() {
        return this.a + this.b;
    }
    @observable get bc() {
        return this.b + this.c;
    }
    @observable get aab() {
        return this.a + this.ab;
    }
}

describe('Graph', function () {
    it('should have minimal updates to mixed level Computed props', function () {
        var viewModel: any = new ViewModel();
        var complete = false;
        viewModel._graph.subscribe('aab', function (value: number) {
            viewModel.runs++;
            if (complete) {
                expect(value).toBe(24);
                expect(viewModel.runs).toBe(2);
            }
        });
        viewModel.a = 11;
        complete = true;
    });
});
