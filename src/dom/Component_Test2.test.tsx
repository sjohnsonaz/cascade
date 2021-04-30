import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { Component } from './Component';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface ICustomComponentProps {
    viewModel: ViewModel;
}

class CustomComponent extends Component<ICustomComponentProps> {
    render() {
        return (
            <div>
                {(() => {
                    this.props.viewModel.runsA++;
                    return (
                        <div>
                            {this.props.viewModel.a}
                            {(() => {
                                this.props.viewModel.runsB++;
                                return <div>{this.props.viewModel.b}</div>;
                            })()}
                        </div>
                    );
                })()}
            </div>
        );
    }
}

describe('Component', function () {
    it('should render once per update', async function () {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <CustomComponent viewModel={viewModel} />);

        Cascade.set(viewModel, 'a', 'a1');
        await Cascade.set(viewModel, 'b', 'b1');

        await Cascade.set(viewModel, 'b', 'b2');

        expect(viewModel.runsA).toBe(3);
        expect(viewModel.runsB).toBe(3);
    });
});
