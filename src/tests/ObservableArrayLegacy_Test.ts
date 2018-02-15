import { expect } from 'chai';

import Cascade, { ObservableArrayLegacy, array, observable } from '../scripts/modules/Cascade';

describe('ObservableArrayLegacy', () => {
    before(function () {
        let $IEversion = window['$IEVersion'];
        let ie = $IEversion === 0 || $IEversion > 11;
        if (ie) {
            this.skip();
        }
    });

    it('should initialize to an emtpy Array', () => {
        var value = new ObservableArrayLegacy();
        expect(value.getValue().length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', () => {
        var value = new ObservableArrayLegacy([1]);
        expect(value.getValue().length).to.equal(1);
    });

    it('should notify subscribers on set method', () => {
        var value = new ObservableArrayLegacy<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.peek().set(0, 10);
    });

    it('should notify subscribers on push method', () => {
        var value = new ObservableArrayLegacy<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.peek().push(10);
    });
});