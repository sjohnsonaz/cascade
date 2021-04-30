import { wait } from '../util/PromiseUtil';

import ObservableArray from './ObservableArray';

describe('ObservableArray', function () {
    it('should initialize to an emtpy Array', function () {
        var value = new ObservableArray();
        expect(value.getValue().length).toBe(0);
    });

    it('should initialize in the constructor to an Array', function () {
        var value = new ObservableArray([1]);
        expect(value.getValue().length).toBe(1);
    });

    it('should notify subscribers on setter', function (done) {
        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).toBe(1);
            expect(currentValue[0]).toBe(0);
            done();
        });
        value.setValue([0]);
    });

    it('should notify subscribers on index setter', function (done) {
        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).toBe(1);
            done();
        });
        value.peek()[0] = 10;
    });

    it('should not notify subscribers on identical setter', async () => {
        var value = new ObservableArray<number>();

        let arrays = [];
        value.subscribeOnly((array) => {
            arrays.push(array);
        });

        let array0 = [0];
        let array1 = [1];

        value.setValue(array0);
        await value.track();

        value.setValue(array1);
        await value.track();

        value.setValue(array1);
        await value.track();

        expect(arrays.length).toBe(2);
        expect(arrays[0][0]).toBe(0);
        expect(arrays[1][0]).toBe(1);
    });

    it('should not notify subscribers on identical index setter', async () => {
        var value = new ObservableArray<number>();

        let values = [];
        value.subscribeOnly((array) => {
            values.push(array[0]);
        });

        value.peek()[0] = 0;
        await value.track();

        value.peek()[0] = 1;
        await value.track();

        value.peek()[0] = 1;
        await value.track();

        expect(values.length).toBe(2);
        expect(values[0]).toBe(0);
        expect(values[1]).toBe(1);
    });

    it('should notify subscribers on setting length', function (done) {
        var value = new ObservableArray<number>([1]);
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).toBe(0);
            done();
        });
        value.peek().length = 0;
    });

    it('should not notify subscribers on identical index setter', async () => {
        var value = new ObservableArray<number>([1]);

        let values = [];
        value.subscribeOnly((array) => {
            values.push(array[0]);
        });

        value.peek().length = 0;
        await value.track();

        value.peek().length = 0;
        await value.track();

        expect(values.length).toBe(1);
        expect(values[0]).toBe(undefined);
    });

    // TODO: Figure out why done calls multiple times.
    it('should notify subscribers on push method', function () {
        var value = new ObservableArray<number>();
        value.subscribeOnly((currentValue) => {
            expect(currentValue.length).toBe(1);
        });
        value.peek().push(10);
    });

    it('should notify subscribers on delete', function (done) {
        var value = new ObservableArray<number>([1]);
        value.subscribeOnly((currentValue) => {
            expect(currentValue[0]).toBe(undefined);
            done();
        });
        delete value.peek()[0];
    });

    it('should not notify subscribers on delete length', async function () {
        var value = new ObservableArray<number>([1]);
        var count = 0;
        value.subscribeOnly((currentValue) => {
            count++;
        });
        try {
            delete value.peek().length;
        } catch (e) {
        } finally {
            await wait(100);

            expect(count).toBe(0);
        }
    });
});
