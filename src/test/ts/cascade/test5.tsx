import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

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

TestRunner.test({
    name: 'ViewModels update VirtualNode rendering once per update',
    test: function(input, callback: any) {
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
                callback({
                    runsA: viewModel.runsA,
                    runsB: viewModel.runsB
                });
            }, 1);
        }, 1);
    },
    assert: function(result, callback) {
        callback(result.runsA === 3 && result.runsB === 3);
    }
});
