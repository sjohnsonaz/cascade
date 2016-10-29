import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable b: string = 'b';
}

interface ICustomComponentProperties {
    id: string;
    viewModel: ViewModel;
}

class CustomComponent extends Component<ICustomComponentProperties> {
    render() {
        return (
            <div>
                {(() => {
                    this.properties.viewModel.runsA++;
                    return <div>
                        {this.properties.viewModel.a}
                        {(() => {
                            this.properties.viewModel.runsB++;
                            return <div>
                                {this.properties.viewModel.b}
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
        var runs = [];
        var complete = false;
        document.body.appendChild(container);
        Cascade.render(container, <CustomComponent viewModel={viewModel} />, function() {
        });
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
        }, 100);
    },
    assert: function(result, callback) {
        console.log(result);
        callback(result.runsA === 3 && result.runsB === 3);
    }
});
