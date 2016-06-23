import TestRunner from '../TestRunner';
import VirtualNode from '../../../scripts/cascade/VirtualNode';

TestRunner.test({
    name: 'VirtualNode trees can render children.',
    test: function(input, callback: any) {
        var root = new VirtualNode('div', { id: 'parent' },
            new VirtualNode('span', { id: 'child' })
        );
        callback(root.element);
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
