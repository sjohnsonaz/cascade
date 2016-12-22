import { expect } from 'chai';

import { observable } from '../scripts/modules/Cascade';

describe('ObservableArray', () => {
    class ViewModel {
        @observable value: any[];
    }
    it('should initialize to an emtpy Array', () => {
        var viewModel = new ViewModel();
        expect(viewModel.value.length).to.equal(0);
    });
});
