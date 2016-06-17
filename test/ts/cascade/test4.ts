import TestRunner from '../TestRunner';
import VirtualNode from '../../../src/cascade/VirtualNode';

TestRunner.test({
    name: 'VirtualNode trees can be rendered to Nodes.',
    test: function(input, callback: any) {
        var root = new VirtualNode('div', { id: 'parent' },
            new VirtualNode('span', { id: 'child' })
        );
        callback(root.render());
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
