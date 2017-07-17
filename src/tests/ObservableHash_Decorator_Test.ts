import { expect } from 'chai';

import { hash, observable, IHash } from '../scripts/modules/Cascade';

describe('ObservableHash @hash Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @hash value: IHash<any>;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).instanceof(Object);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @hash value: IHash<any> = {
                'property': 10
            };
        }
        var viewModel = new ViewModel();
        expect(viewModel.value['property']).to.equal(10);
    });
});

