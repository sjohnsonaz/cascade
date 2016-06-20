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
    info: string;
}

class ParentComponent extends VirtualNode<ParentComponentProperties> {
    viewModel: ViewModel;
    constructor(type: string, properties?: ParentComponentProperties, ...children: (VirtualNode<any> | string)[]) {
        super(type, properties, ...children);
        this.viewModel = new ViewModel();
        window.viewModel = this.viewModel;
    }
    render() {
        return (
            <div id="parent">
                <CustomComponent id="child" info={this.viewModel.info}>text</CustomComponent>
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
        var root = (
            <ParentComponent />
        );
        root._graph.observables.element.subscribe(function(value) {
            console.log(value);
        });
        window.root = root;
        document.body.appendChild(root.element);
        callback(root.element);
    },
    assert: function(result, callback) {
        var child = result.querySelector('#child');
        callback(!!child);
    }
});
