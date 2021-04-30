import Cascade from './Cascade';
import { IHash } from '../graph/IObservable';

describe('Cascade', function () {
    describe('createObservable', function () {
        it('should initialize to undefined', function () {
            class ViewModel {
                value: number;
                constructor() {
                    Cascade.createObservable(this, 'value');
                }
            }
            var viewModel = new ViewModel();
            expect(viewModel.value).toBeUndefined();
        });

        it('should initialize in the constructor to a value', function () {
            class ViewModel {
                value: number;
                constructor() {
                    Cascade.createObservable(this, 'value', 1);
                }
            }
            var viewModel = new ViewModel();
            expect(viewModel.value).toBe(1);
        });
    });

    describe('createObservableArray', function () {
        it('should initialize undefined to empty', function () {
            class ViewModel {
                value: number[];
                constructor() {
                    Cascade.createObservableArray(this, 'value');
                }
            }
            var viewModel = new ViewModel();
            expect(viewModel.value.length).toBe(0);
        });

        it('should initialize in the constructor to a value', function () {
            class ViewModel {
                value: number[];
                constructor() {
                    Cascade.createObservableArray(this, 'value', [1]);
                }
            }
            var viewModel = new ViewModel();
            expect(viewModel.value.length).toBe(1);
        });
    });

    describe('createObservableHash', function () {
        it('should initialize undefined to empty', function () {
            class ViewModel {
                value: IHash<number>;
                constructor() {
                    Cascade.createObservableHash(this, 'value');
                }
            }
            var viewModel = new ViewModel();
            expect(viewModel.value).toBeInstanceOf(Object);
        });

        it('should initialize in the constructor to a value', function () {
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
});
