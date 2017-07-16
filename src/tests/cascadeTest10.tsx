import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

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
    it('should render property updates', function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs: string[] = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />, function () {
            var parent = container.querySelector('#parent');
            runs.push((parent.childNodes[0] as HTMLElement).id);
        });
        viewModel.id = 'newId';
        setTimeout(function () {
            var parent = container.querySelector('#parent');
            runs.push((parent.childNodes[0] as HTMLElement).id);
            expect(runs[0]).to.equal('oldId');
            expect(runs[1]).to.equal('newId');
        }, 20);
    });
});
