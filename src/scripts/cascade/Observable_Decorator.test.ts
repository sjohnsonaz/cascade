import { observable } from './Decorators';

describe('Observable @observable Decorator', () => {
    it('should initialize to undefined', () => {
        class ViewModel {
            @observable value;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBe(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            @observable value = 1;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBe(1);
    });
});
