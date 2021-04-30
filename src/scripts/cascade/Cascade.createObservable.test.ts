import Cascade from './Cascade';

describe('Cascade.createObservable', () => {
    it('should initialize to undefined', () => {
        class ViewModel {
            value: number;
            constructor() {
                Cascade.createObservable(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBeUndefined();
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: number;
            constructor() {
                Cascade.createObservable(this, 'value', 1);
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBe(1);
    });
});
