import { expect } from 'chai';

import Cascade, { Observable, observable } from '../scripts/modules/Cascade';

describe('Observable', () => {
    it('should initialize to undefined', () => {
        var value = new Observable();
        expect(value.getValue()).to.equal(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        var value = new Observable(1);
        expect(value.getValue()).to.equal(1);
    });
});

describe('Cascade.createObservable', () => {
    it('should initialize to undefined', () => {
        class ViewModel {
            value: number;
            constructor() {
                Cascade.createObservable(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: number;
            constructor() {
                Cascade.createObservable(this, 'value', 1);
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });
});

describe('Observable @observable Decorator', () => {
    it('should initialize to undefined', () => {
        class ViewModel {
            @observable value;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            @observable value = 1;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });
});
