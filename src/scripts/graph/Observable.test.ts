import Observable from './Observable';

describe('Observable', () => {
    it('should initialize to undefined', () => {
        var value = new Observable();
        expect(value.getValue()).toBe(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        var value = new Observable(1);
        expect(value.getValue()).toBe(1);
    });
});
