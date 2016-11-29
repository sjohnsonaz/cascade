import {expect} from 'chai';

import Cascade, {Component, observable} from '../../scripts/modules/Cascade';

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
                    return <div>
                        {this.props.viewModel.a}
                        {(() => {
                            this.props.viewModel.runsB++;
                            return <div>
                                {this.props.viewModel.b}
                            </div>
                        })()}
                    </div>
                })()}
            </div>
        )
    }
}

describe('Component', function() {
    it('should render once per update', function() {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <CustomComponent viewModel={viewModel} />, function() {
        });
        viewModel.a = 'a1';
        viewModel.b = 'b1';
        setTimeout(function() {
            viewModel.b = 'b2';
            setTimeout(function() {
                    expect(viewModel.runsA).to.equal(3);
                    expect(viewModel.runsB).to.equal(3);
            }, 20);
        }, 1);
    });
});
