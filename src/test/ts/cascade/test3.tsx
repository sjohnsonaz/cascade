import TestRunner from '../TestRunner';
import Cascade, {Component} from '../../../scripts/modules/Cascade';

interface CustomComponentProperties {
    id: string;
    info: string;
}

class CustomComponent extends Component<CustomComponentProperties> {
    render() {
        return (
            <div id={this.props.id}>Custom Component - {this.props.info}</div>
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
