import TestRunner from '../TestRunner';
import Graph from '../../../src/graph/Graph';
import Cascade, {VirtualNode} from '../../../src/cascade/Cascade';

class ViewModel {
    runs: number = 0;
    info: string;
    constructor() {
        Graph.createObservable(this, 'info', 'test');
    }
}

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
        var viewModel = new ViewModel();
        var root = (
            <div id="parent">
                <CustomComponent id="child" info="test">text</CustomComponent>
            </div>
        );
        callback(root.element);
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
