import TestRunner from '../TestRunner';
import VirtualNode from '../../../src/cascade/VirtualNode';
import Cascade from '../../../src/cascade/Cascade';

TestRunner.test({
    name: 'JSX can be used to generate VirtualNode trees.',
    test: function(input, callback: any) {
        var root = (
            <div id="parent">
                <span id="child">text</span>
            </div>
        );
        callback(root.render());
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
