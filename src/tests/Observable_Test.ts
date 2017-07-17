import { expect } from 'chai';

import { Observable } from '../scripts/modules/Cascade';

describe('Observable', () => {
    it('should initialize to undefined', () => {
        var value = new Observable();
        expect(value.getValue()).to.equal(undefined);
    });

    it('should initialize in the constructor to a value', () => {
        var value = new Observable(1);
        expect(value.getValue()).to.equal(1);
    });
});