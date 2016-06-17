import TestRunner from '../TestRunner';
import VirtualNode from '../../../src/cascade/VirtualNode';
import Cascade from '../../../src/cascade/Cascade';

interface CustomComponentProperties {
    id: string;
    info: string;
}

class CustomComponent extends VirtualNode<CustomComponentProperties> {
    render() {
        return (
            <div>Custom Component</div>
        )
    }
}

TestRunner.test({
    name: 'JSX can be used to generate VirtualNode trees.',
    test: function(input, callback: any) {
        var root = (
            <div id="parent">
                <CustomComponent id="child" a="test">text</CustomComponent>
            </div>
        );
        callback(root.toNode());
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
