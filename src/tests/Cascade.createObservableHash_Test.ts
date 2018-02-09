import { expect } from 'chai';

import Cascade, { IHash } from '../scripts/modules/Cascade';

describe('Cascade.createObservableHash', () => {
    before(function () {
        let $IEversion = window['$IEVersion'];
        let ie = 0 < $IEversion && $IEversion <= 11;
        if (ie) {
            this.skip();
        }
    });

    it('should initialize undefined to empty', () => {
        class ViewModel {
            value: IHash<any>;
            constructor() {
                Cascade.createObservableHash(this, 'value');
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value).instanceof(Object);
    });

    it('should initialize in the constructor to a value', () => {
        class ViewModel {
            value: IHash<any>;
            constructor() {
                Cascade.createObservableHash(this, 'value', {
                    'property': 10
                });
            }
        }
        var viewModel = new ViewModel();
        expect(viewModel.value['property']).to.equal(10);
    });
});