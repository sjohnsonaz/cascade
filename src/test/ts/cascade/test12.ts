import TestRunner from '../TestRunner';
import Diff from '../../../scripts/cascade/Diff';

TestRunner.test({
    name: 'Diff algorithm generates comparison information',
    test: function(input, callback: any) {
        var diff = Diff.compare('ab', 'ac');
        var diff = Diff.compare('ac', 'bc');
        var diff = Diff.compare('acd', 'bd');
        var diff = Diff.compare('abcde', 'abdfe');
        var lcs = [];
        diff.reverse();
        for (var index = 0, length = diff.length; index < length; index++) {
            var diffItem = diff[index];
            if (diffItem.operation === 0) {
                lcs.push(diffItem.item);
            }
        }
        callback(lcs.join(''));
    },
    assert: function(result, callback) {
        callback(result === 'abde');
    }
});
