import TestRunner from '../TestRunner';
import Cascade, {Component, observable, array} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @array list: number[] = [1, 2, 3, 4];
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        this.properties.viewModel.runsA++;
        return (
            <Child id="child" viewModel={this.properties.viewModel} />
        );
    }
}

interface IChildProperties {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProperties> {
    render() {
        this.properties.viewModel.runsB++;
        return (
            <ul>
                {this.properties.viewModel.list.map(item => <li>{item}</li>)}
            </ul>
        );
    }
}

TestRunner.test({
    name: 'ViewModels update directly nested Components',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        setTimeout(function() {
            viewModel.list.push(5);
            setTimeout(function() {
                callback({
                    length: container.querySelectorAll('li').length,
                    runsA: viewModel.runsA,
                    runsB: viewModel.runsB
                });
            }, 20);
        }, 1);
    },
    assert: function(result, callback) {
        callback(result.runsA === 1 && result.runsB === 2 && result.length === 5);
    }
});
