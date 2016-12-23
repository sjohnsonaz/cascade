import { expect } from 'chai';

import Cascade, { ObservableArray, array, observable } from '../scripts/modules/Cascade';

describe('ObservableArray', () => {
    it('should initialize to an emtpy Array', () => {
        var value = new ObservableArray();
        expect(value.getValue().length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', () => {
        var value = new ObservableArray([1]);
        expect(value.getValue().length).to.equal(1);
    });
});

describe('Cascade.createObservable', () => {
    it('should initialize to undefined', () => {
        class ViewModel {
            value: any[];
            constructor() {
                Cascade.createObservableArray(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(0);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: any[];
            constructor() {
                Cascade.createObservableArray(this, 'value', [1]);
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(1);
    });
});

describe('ObservableArray @observable Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @observable value: any[];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @observable value: any[] = [1];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(1);
    });
});

describe('ObservableArray @array Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @array value: any[];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @array value: any[] = [1];
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(1);
    });
});

