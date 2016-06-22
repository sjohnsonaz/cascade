import TestRunner from '../TestRunner';
import Cascade, {VirtualNode} from '../../../scripts/modules/Cascade';

TestRunner.test({
    name: 'JSX can be used to generate VirtualNode trees.',
    test: function(input, callback: any) {
        var root = (
            <div id="parent">
                <span id="child">text</span>
            </div>
        );
        Cascade.render(document.createElement('div'), root, function(element) {
            callback(element);
        });
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
