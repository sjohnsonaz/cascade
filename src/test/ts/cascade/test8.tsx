import TestRunner from '../TestRunner';
import Cascade, {VirtualNode} from '../../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    a: string;
    b: string;
    constructor() {
        Cascade.createObservable(this, 'a', 'a');
        Cascade.createObservable(this, 'b', 'b');
    }
}

interface CustomComponentProperties {
    id: string;
    viewModel: ViewModel;
}

class CustomComponent extends VirtualNode<CustomComponentProperties> {
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
    name: 'ViewModels update VirtualNode rendering.',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        var complete = false;
        document.body.appendChild(container);
        Cascade.render(container, <CustomComponent viewModel={viewModel} />, function() {
        });
        //viewModel.a = 'a1';
        setTimeout(function() {
            complete = true;
            viewModel.b = 'b1';
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
        callback(result.runsA === 2 && result.runsB === 3);
    }
});
