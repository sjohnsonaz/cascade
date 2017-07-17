import { expect } from 'chai';

import Cascade, { ObservableHash } from '../scripts/modules/Cascade';

// TODO: Remove Proxy check
describe('ObservableHash', function () {
    it('should initialize to an emtpy Hash', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableHash();
        expect(value.getValue()).instanceof(Object);
    });

    it('should initialize in the constructor to an Array', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableHash({
            property: 1
        });
        expect(value.getValue().property).to.equal(1);
    });

    it('should notify subscribers on setter', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableHash<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue['property']).to.equal(10);
        });
        value.peek()['property'] = 10;
    });
});