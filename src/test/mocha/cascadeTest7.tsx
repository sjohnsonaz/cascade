import {expect} from 'chai';

import Cascade, {Component, observable, array} from '../../scripts/modules/Cascade';

class ViewModel {
    runsA: number = 0;
    runsB: number = 0;
    @observable a: string = 'a';
    @observable list: number[] = [1, 2, 3, 4];
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    render() {
        this.properties.viewModel.runsA++;
        return (
            <Child id="child" viewModel={this.properties.viewModel} />
        );
    }
}

interface IChildProperties {
    id: string;
    viewModel: ViewModel;
}

class Child extends Component<IChildProperties> {
    render() {
        this.properties.viewModel.runsB++;
        return (
            <ul>
                {this.properties.viewModel.list.map(item => <li>{item}</li>)}
            </ul>
        );
    }
}

describe('Component', function() {
    it('should updated directly nested Components with arrays', function() {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        setTimeout(function() {
            viewModel.list.push(5);
            setTimeout(function() {
                expect(container.querySelectorAll('li').length).to.equal(5);
                expect(viewModel.runsA).to.equal(1);
                expect(viewModel.runsB).to.equal(2);
            }, 20);
        }, 1);
    });
});
