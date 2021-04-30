import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

class ViewModel {
    @observable id: string = 'oldId';
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    render() {
        return (
            <div id="parent">
                <span id={this.props.viewModel.id}>Text</span>
            </div>
        );
    }
}

describe('Component', function () {
    it('should render property updates', async function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs: string[] = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);

        var parent = container.querySelector('#parent');
        runs.push((parent.childNodes[0] as HTMLElement).id);

        viewModel.id = 'newId';

        await wait(20);

        var parent = container.querySelector('#parent');
        runs.push((parent.childNodes[0] as HTMLElement).id);
        expect(runs[0]).toBe('oldId');
        expect(runs[1]).toBe('newId');
    });
});
