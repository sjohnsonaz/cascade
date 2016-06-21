declare var window: any;

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

interface ParentComponentProperties {
    id: string;
    viewModel: ViewModel;
}

class ParentComponent extends VirtualNode<ParentComponentProperties> {
    constructor(type: string, properties?: ParentComponentProperties, ...children: (VirtualNode<any> | string)[]) {
        super(type, properties, ...children);
    }
    render() {
        return (
            <div id="parent">
                <CustomComponent id="child" info={this.properties.viewModel.info}>text</CustomComponent>
            </div>
        );
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
        window.viewModel = viewModel;
        Cascade.render(document.body, <ParentComponent viewModel={viewModel} />, function(element) {
            callback(element);
        });
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
