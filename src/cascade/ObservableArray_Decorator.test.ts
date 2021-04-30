import 'reflect-metadata';

import { array, observable } from './Decorators';

describe('ObservableArray @observable Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @observable value: any[];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(0);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @observable value: any[] = [1];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(1);
    });
});

describe('ObservableArray @array Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @array value: any[];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(0);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @array value: any[] = [1];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).toBe(1);
    });
});
