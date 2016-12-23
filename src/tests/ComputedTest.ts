import { expect } from 'chai';

import Cascade, { Computed, computed, observable, Observable } from '../scripts/modules/Cascade';

describe('Computed', () => {
    it('should compute non-observable values', () => {
        var value = new Computed(() => {
            return 1;
        });
        expect(value.getValue()).to.equal(1);
    });

    it('should compute observable values', () => {
        var obs = new Observable(1);
        var value = new Computed(() => {
            return obs.getValue();
        });
        expect(value.getValue()).to.equal(1);
    });
});

describe('Cascade.createComputed', () => {
    it('should compute non-observable values', () => {
        class ViewModel {
            value: number;
            constructor() {
                Cascade.createComputed(this, 'value', () => {
                    return 1;
                });
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });

    it('should compute observable values', () => {
        class ViewModel {
            value: number;
            obs: number;
            constructor() {
                Cascade.createObservable(this, 'obs', 1);
                Cascade.createComputed(this, 'value', () => {
                    return this.obs;
                });

            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });
});

describe('Computed @observable Decorator', () => {
    it('should compute non-observable values', () => {
        class ViewModel {
            @observable get value() {
                return 1;
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });

    it('should compute observable values', () => {
        class ViewModel {
            @observable obs = 1;
            @observable get value() {
                return this.obs;
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).to.equal(1);
    });
});
