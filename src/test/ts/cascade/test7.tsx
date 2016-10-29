import TestRunner from '../TestRunner';
import Cascade, {Component} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    a: string;
    b: string;
    constructor() {
        Cascade.createObservable(this, 'a', 'a');
        Cascade.createObservable(this, 'b', 'b');
    }
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
            <div>
                {this.properties.viewModel.b}
            </div>
        );
    }
}

TestRunner.test({
    name: 'ViewModels update directly nested Components',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        var complete = false;
        document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        viewModel.a = 'a1';
        viewModel.b = 'b1';
        setTimeout(function() {
            complete = true;
            viewModel.b = 'b2';
            setTimeout(function() {
                callback({
                    runsA: viewModel.runsA,
                    runsB: viewModel.runsB
                });
            }, 200);
        }, 1);
    },
    assert: function(result, callback) {
        console.log(result);
        callback(result.runsA === 1 && result.runsB === 3);
    }
});
