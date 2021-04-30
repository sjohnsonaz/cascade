import { IHash } from '../graph/IObservable';
import Cascade from './Cascade';

describe('Cascade.createObservableHash', () => {
    it('should initialize undefined to empty', () => {
        class ViewModel {
            value: IHash<number>;
            constructor() {
                Cascade.createObservableHash(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).toBeInstanceOf(Object);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: IHash<number>;
            constructor() {
                Cascade.createObservableHash(this, 'value', {
                    property: 10,
                });
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value['property']).toBe(10);
    });
});
