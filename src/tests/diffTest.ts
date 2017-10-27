import { expect } from 'chai';

import Diff, { IDiffItem } from '../scripts/util/Diff';

describe('Diff', function () {
    it('should be able to diff empty and a value', function () {
        var lcs = createLCS(Diff.compare('', 'a'));
        expect(lcs).to.equal('');
    });

    it('should be able to diff a value and empty', function () {
        var lcs = createLCS(Diff.compare('a', ''));
        expect(lcs).to.equal('');
    });

    it('should be able to diff an added character', function () {
        var lcs = createLCS(Diff.compare('a', 'ab'));
        expect(lcs).to.equal('a');
    });

    it('should be able to diff same first character', function () {
        var lcs = createLCS(Diff.compare('ab', 'ac'));
        expect(lcs).to.equal('a');
    });

    it('should be able to diff same last character', function () {
        var lcs = createLCS(Diff.compare('ac', 'bc'));
        expect(lcs).to.equal('c');
    });

    it('should be able to diff different length differences', function () {
        var lcs = createLCS(Diff.compare('acd', 'bd'));
        expect(lcs).to.equal('d');
    });

    it('should be able to diff a complex change', function () {
        var lcs = createLCS(Diff.compare('abcde', 'abdfe'));
        expect(lcs).to.equal('abde');
    });
});

function createLCS<T>(diff: IDiffItem<T>[]) {
    diff.reverse();
    var lcs = [];
    for (var index = 0, length = diff.length; index < length; index++) {
        var diffItem = diff[index];
        if (diffItem.operation === 0) {
            lcs.push(diffItem.item);
        }
    }
    return lcs.join('');
}
