import { expect } from 'chai';

import Cascade, { ObservableArray } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

// TODO: Remove Proxy check
describe('ObservableArray', function () {
    it('should initialize to an emtpy Array', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray();
        expect(value.getValue().length).to.equal(0);
    });

    it('should initialize in the constructor to an Array', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray([1]);
        expect(value.getValue().length).to.equal(1);
    });

    it('should notify subscribers on set method', function (done) {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
            done();
        });
        value.peek().set(0, 10);
    });

    it('should notify subscribers on setter', function (done) {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
            done();
        });
        value.peek()[0] = 10;
    });

    it('should notify subscribers on setting length', function (done) {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>([1]);
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(0);
            done();
        });
        value.peek().length = 0;
    });

    // TODO: Figure out why done calls multiple times.
    it('should notify subscribers on push method', function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).to.equal(1);
        });
        value.peek().push(10);
    });

    it('should notify subscribers on delete', function (done) {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>([1]);
        value.subscribeOnly((currentValue) => {
            expect(currentValue[0]).to.equal(undefined);
            done();
        });
        delete value.peek()[0];
    });

    it('should not notify subscribers on delete length', async function () {
        if (!Cascade.proxyAvailable) this.skip();

        var value = new ObservableArray<number>([1]);
        var count = 0;
        value.subscribeOnly((currentValue) => {
            count++;
        });
        try {
            delete value.peek().length;
        }
        catch (e) {

        }
        finally {
            await wait(100);

            expect(count).to.equal(0);
        }
    });
});