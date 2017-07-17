import { expect } from 'chai';

import Cascade, { ObservableArray, array, observable } from '../scripts/modules/Cascade';

// TODO: Remove Proxy check
declare var Proxy: any;
let proxyUnavailable = typeof Proxy === 'undefined';

describe('ObservableArray', function () {
    it('should initialize to an emtpy Array', function () {
        if (proxyUnavailable) this.skip();

        var value = new ObservableArray();
        expect(value.getValue().length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', function () {
        if (proxyUnavailable) this.skip();

        var value = new ObservableArray([1]);
        expect(value.getValue().length).to.equal(1);
    });

    it('should notify subscribers on set method', function () {
        if (proxyUnavailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.set(0, 10 as any);
    });

    it('should notify subscribers on setter', function () {
        if (proxyUnavailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.peek()[0] = 10;
    });

    it('should notify subscribers on push method', function () {
        if (proxyUnavailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.peek().push(10);
    });
});