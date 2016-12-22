import { expect } from 'chai';

import { observable } from '../scripts/modules/Cascade';

describe('Observable', () => {
    class ViewModel {
        @observable value;
    }
    it('should initialize to undefined', () => {
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(undefined);
    });
});
