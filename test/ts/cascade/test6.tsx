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
            <div id={this.properties.id}>Custom Component - {this.properties.info}</div>
        )
    }
}

TestRunner.test({
    name: 'VirtualNodes can be used to create Components.',
    test: function(input, callback: any) {
        var root = (
            <div id="parent">
                <CustomComponent id="child" info="test">text</CustomComponent>
            </div>
        );
        callback(root.toNode());
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
