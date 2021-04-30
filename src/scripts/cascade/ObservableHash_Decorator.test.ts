import { IHash } from '../graph/IObservable';

import { hash } from './Decorators';

describe('ObservableHash @hash Decorator', () => {
    it('should initialize to an emtpy Array', () => {
        class ViewModel {
            @hash value: IHash<any>;
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBeInstanceOf(Object);
    });

    it('should initialize in the constructor to an Array', () => {
        class ViewModel {
            @hash value: IHash<any> = {
                property: 10,
            };
        }
        var viewModel = new ViewModel();
        expect(viewModel.value['property']).toBe(10);
    });
});
