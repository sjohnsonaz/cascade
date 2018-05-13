import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

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

describe('Component', function () {
    it('should update when observables change', async function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs: string[] = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);

        var child = container.querySelector('#child');
        runs.push((child.childNodes[1] as Text).data);

        viewModel.info = 'abcd';

        await wait(20);

        var child = container.querySelector('#child');
        runs.push((child.childNodes[1] as Text).data);
        expect(runs[0]).to.equal('test');
        expect(runs[1]).to.equal('abcd');
    });
});
