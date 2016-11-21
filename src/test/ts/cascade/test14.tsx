import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';

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

TestRunner.test({
    name: 'VirtualNode props update.',
    test: function(input, callback: any) {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        var runs = [];
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />, function(element: HTMLElement) {
            var parent = container.querySelector('#parent');
            runs.push((parent.childNodes[0] as HTMLElement).id);
        });
        viewModel.id= 'newId';
        setTimeout(function() {
            var parent = container.querySelector('#parent');
            runs.push((parent.childNodes[0] as HTMLElement).id);
            callback(runs);
        }, 20);
    },
    assert: function(result, callback) {
        callback(result[0] === 'oldId' && result[1] === 'newId');
    }
});
