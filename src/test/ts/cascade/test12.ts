import TestRunner from '../TestRunner';
import Diff, {IDiffItem} from '../../../scripts/cascade/Diff';

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

TestRunner.test({
    name: 'Diff algorithm generates comparison information',
    test: function(input, callback: any) {
        var results = [];
        var diff;
        diff = Diff.compare('', 'a');
        results.push(createLCS(diff));
        diff = Diff.compare('a', '');
        results.push(createLCS(diff));
        diff = Diff.compare('ab', 'ac');
        results.push(createLCS(diff));
        diff = Diff.compare('ac', 'bc');
        results.push(createLCS(diff));
        diff = Diff.compare('acd', 'bd');
        results.push(createLCS(diff));
        diff = Diff.compare('abcde', 'abdfe');
        results.push(createLCS(diff));
        callback(results);
    },
    assert: function(result, callback) {
        callback(
            result[0] === '' &&
            result[1] === '' &&
            result[2] === 'a' &&
            result[3] === 'c' &&
            result[4] === 'd' &&
            result[5] === 'abde'
        );
    }
});
