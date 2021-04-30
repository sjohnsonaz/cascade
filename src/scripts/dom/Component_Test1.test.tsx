import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { Component } from './Component';

class ViewModel {
    runs: number = 0;
    @observable info: string = 'test';
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        return (
            <div id="parent">
                <Child id="child" info={this.props.viewModel.info}>
                    text
                </Child>
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
        return <div id={this.props.id}>Custom Component - {this.props.info}</div>;
    }
}

describe('Component', function () {
    it('should update when observables change', async function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs: string[] = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);

        var child = container.querySelector('#child');
        runs.push((child.childNodes[1] as Text).data);

        await Cascade.set(viewModel, 'info', 'abcd');

        var child = container.querySelector('#child');
        runs.push((child.childNodes[1] as Text).data);
        expect(runs[0]).toBe('test');
        expect(runs[1]).toBe('abcd');
    });
});
