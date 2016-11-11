import TestRunner from '../TestRunner';
import Cascade, {Component, observable} from '../../../scripts/modules/Cascade';
import Diff from '../../../scripts/cascade/Diff';

class ViewModel {
    @observable a: string = 'a';
    parentNode: Node;
    childNode: Node;
    parentRef(node: Node) {
        this.parentNode = node;
    }
    childRef(node: Node) {
        this.childNode = node;
    }
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        return (
            <div>
                <span ref={this.properties.viewModel.childRef.bind(this.properties.viewModel)}>Text</span>
            </div>
        );
    }
}

TestRunner.test({
    name: 'VirtualNode and Component use ref callbacks',
    test: function(input, callback: any) {
        //var viewModel = new ViewModel();
        //var container = document.createElement('div');
        //document.body.appendChild(container);
        //Cascade.render(container, <Parent viewModel={viewModel} ref={viewModel.parentRef.bind(viewModel)}/>);
        var lcs = Diff.lcs('abcd', 'abd');
        callback(lcs);
    },
    assert: function(result, callback) {
        callback(result === 'abd');
    }
});
