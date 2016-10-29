import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    clicked: number = 0;
    onclick() {
        this.clicked++;
    }
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    onclick() {
        this.properties.viewModel.onclick();
    }
    render() {
        return (
            <Child onclick={this.onclick.bind(this)} />
        );
    }
}

interface IChildProperties {
    onclick: Function;
}

class Child extends Component<IChildProperties> {
    render() {
        return (
            <button id="test9-button" onclick={this.properties.onclick}>Click</button>
        );
    }
}

TestRunner.test({
    name: 'ViewModels update directly nested Components with children',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        var complete = false;
        document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        var button = document.getElementById('test9-button');
        button.click();
        callback(viewModel.clicked);
    },
    assert: function(result, callback) {
        callback(1);
    }
});
