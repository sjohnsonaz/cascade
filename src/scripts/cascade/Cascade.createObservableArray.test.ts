import Cascade from './Cascade';

describe('Cascade.createObservableArray', () => {
    it('should initialize undefined to empty', () => {
        class ViewModel {
            value: number[];
            constructor() {
                Cascade.createObservableArray(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(0);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: number[];
            constructor() {
                Cascade.createObservableArray(this, 'value', [1]);
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(1);
    });
});
