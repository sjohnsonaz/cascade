import TestRunner from '../TestRunner';
import VirtualNode from '../../../src/cascade/VirtualNode';

TestRunner.test({
    name: 'VirtualNode trees can be rendered to Nodes.',
    test: function (input, callback: any) {
        var root = new VirtualNode('div', {}, 'text');
        callback(root.toNode());
    },
    assert: function (result, callback) {
        callback(result.textContent === 'text');
    }
});
