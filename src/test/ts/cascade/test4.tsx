import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runs: number = 0;
    @observable info: string = 'test';
}

interface IParentProps {
    id: string;
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        return (
            <div id="parent">
                <Child id="child" info={this.props.viewModel.info}>text</Child>
            </div>
        );
    }
}

interface IChildProps {
    id: string;
    info: string;
}

class Child extends Component<IChildProps> {
    render() {
        return (
            <div id={this.props.id}>Custom Component - {this.props.info}</div>
        )
    }
}

TestRunner.test({
    name: 'ViewModels update VirtualNode rendering.',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />, function(element: HTMLElement) {
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
        callback(result[0] === 'test' && result[1] === 'abcd');
    }
});
