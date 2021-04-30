import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        this.props.viewModel.runsA++;
        return <Child id="child" viewModel={this.props.viewModel} />;
    }
}

interface IChildProps {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProps> {
    render() {
        this.props.viewModel.runsB++;
        return <div>{this.props.viewModel.b}</div>;
    }
}

describe('Component', function () {
    it('should update directly nested Components', async function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        viewModel.a = 'a1';
        viewModel.b = 'b1';

        await wait(1);

        viewModel.b = 'b2';

        await wait(20);

        expect(viewModel.runsA).toBe(1);
        expect(viewModel.runsB).toBe(3);
    });
});
