import TestRunner from '../TestRunner';
import Cascade, {Component, observable, array} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable list: number[] = [1, 2, 3, 4];
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        this.props.viewModel.runsA++;
        return (
            <Child id="child" viewModel={this.props.viewModel} />
        );
    }
}

interface IChildProps {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProps> {
    render() {
        this.props.viewModel.runsB++;
        return (
            <ul>
                {this.props.viewModel.list.map(item => <li>{item}</li>)}
            </ul>
        );
    }
}

TestRunner.test({
    name: 'ViewModels update directly nested Components with arrays',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
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
