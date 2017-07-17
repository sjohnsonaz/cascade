import { expect } from 'chai';

import { observable } from '../scripts/modules/Cascade';

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