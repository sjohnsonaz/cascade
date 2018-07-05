import { expect } from 'chai';

import Cascade, { Computed, observable, Observable, IObservable } from '../scripts/modules/Cascade';

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

    it('should subscribe once per Observable', () => {
        var obs = new Observable(1);
        let readCount = 0;
        let referenceCount = 0;
        var value = new Computed(() => {
            obs.getValue();
            let observableContext = window['$_cascade_observable_context'];
            let context: IObservable<any>[] = observableContext.context;
            let output = obs.getValue();
            readCount = context.length;
            return output;
        });
        referenceCount = value.references.length;
        expect(readCount).to.equal(2);
        expect(referenceCount).to.equal(1);
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

describe('Cascade.waitToEqual', () => {
    it('should run on equal, and not run twice', async () => {
        class ViewModel {
            @observable a: boolean = false;
        }
        var viewModel = new ViewModel();
        window.setTimeout(() => {
            viewModel.a = true;
            window.setTimeout(() => {
                viewModel.a = false;
            }, 10)
        }, 10)
        let result = await Cascade.waitToEqual(viewModel, 'a', true, 100);
        expect(result).to.equal(true);
    });

    it('should not run if not equal, and then throw an error if time elapses', async () => {
        class ViewModel {
            @observable a: boolean = false;
        }
        var viewModel = new ViewModel();
        window.setTimeout(() => {
            viewModel.a = undefined;
        }, 10)
        try {
            var result = await Cascade.waitToEqual(viewModel, 'a', true, 100);
        } catch (e) {
            expect(e).to.not.be.undefined;
            expect((e as Error).message).to.equal('Timeout elapsed');
        }
        expect(result).to.not.equal(true);
    });
});