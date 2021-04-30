import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';
import { wait } from '../util/PromiseUtil';

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
                expect(value).toBe(150);
                expect(viewModel.runs).toBe(2);
            }
        });
        viewModel.a = 11;
        viewModel.b = 12;
        viewModel.c = 13;
        viewModel.d = 14;
        complete = true;
    });
});

describe('Cascade.track', () => {
    it('should emit a Promise which resolves when push is complete', async () => {
        var viewModel: any = new ViewModel();
        await wait(20);
        var abcd = undefined;
        viewModel._graph.subscribe('abcd', function (value: number) {});
        viewModel.a = 11;
        viewModel.b = 12;
        viewModel.c = 13;
        viewModel.d = 14;
        await Cascade.track(viewModel, 'd');
        abcd = Cascade.peekDirty(viewModel, 'abcd');
        expect(abcd).toBe(150);
    });
});

describe('Cascade.trackAll', () => {
    it('should emit a Promise which resolves when push is complete', async () => {
        var viewModel: any = new ViewModel();
        await wait(20);
        var abcd = undefined;
        viewModel._graph.subscribe('abcd', function (value: number) {});
        viewModel.a = 11;
        viewModel.b = 12;
        viewModel.c = 13;
        viewModel.d = 14;
        await Cascade.trackAll(viewModel);
        abcd = Cascade.peekDirty(viewModel, 'abcd');
        expect(abcd).toBe(150);
    });
});
