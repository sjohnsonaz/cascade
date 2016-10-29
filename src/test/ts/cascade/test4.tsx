import TestRunner from '../TestRunner';
import Cascade, {Component} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    info: string;
    constructor() {
        Cascade.createObservable(this, 'info', 'test');
    }
}

interface ParentComponentProperties {
    id: string;
    viewModel: ViewModel;
}

class ParentComponent extends Component<ParentComponentProperties> {
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

class CustomComponent extends Component<CustomComponentProperties> {
    render() {
        return (
            <div id={this.properties.id}>Custom Component - {this.properties.info}</div>
        )
    }
}

TestRunner.test({
    name: 'ViewModels update VirtualNode rendering.',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        document.body.appendChild(container);
        Cascade.render(container, <ParentComponent viewModel={viewModel} />, function(element: HTMLElement) {
            var child = container.querySelector('#child');
            runs.push((child.childNodes[1] as Text).data);
        });
        viewModel.info = 'abcd';
        setTimeout(function() {
            var child = container.querySelector('#child');
            runs.push((child.childNodes[1] as Text).data);
            callback(runs);
        }, 20);
    },
    assert: function(result, callback) {
        console.log(result);
        callback(result[0] === 'test' && result[1] === 'abcd');
    }
});
