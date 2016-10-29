import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        this.properties.viewModel.runsA++;
        return (
            <Child id="child" viewModel={this.properties.viewModel}>
                <div>
                    {this.properties.viewModel.a}
                </div>
            </Child>
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
                <div>
                    {this.properties.viewModel.b}
                </div>
                <div>
                    {this.children}
                </div>
            </div>
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
        callback(result.runsA === 2 && result.runsB === 3);
    }
});
