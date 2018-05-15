import { expect } from 'chai';

import Cascade from '../scripts/modules/Cascade';

describe('Cascade.createObservableArray', () => {
    it('should initialize undefined to empty', () => {
        class ViewModel {
            value: number[];
            constructor() {
                Cascade.createObservableArray(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(0);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: number[];
            constructor() {
                Cascade.createObservableArray(this, 'value', [1]);
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(1);
    });
});