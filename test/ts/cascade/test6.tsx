import TestRunner from '../TestRunner';
import Cascade, {VirtualNode} from '../../../src/modules/Cascade';

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
        Cascade.render(document.createElement('div'), root, function(element) {
            callback(element);
        });
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(child.textContent === 'Custom Component - test');
    }
});
