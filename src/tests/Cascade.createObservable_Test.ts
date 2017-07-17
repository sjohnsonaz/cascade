import { expect } from 'chai';

import Cascade from '../scripts/modules/Cascade';

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