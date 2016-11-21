import {expect} from 'chai';

import Cascade, {Component, observable} from '../../scripts/modules/Cascade';

class ViewModel {
    clicked: number = 0;
    clickedValue: string = '';
    @observable value: string = '';
    onclick() {
        this.clicked++;
        this.clickedValue = this.value;
    }
}

interface IParentProperties {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProperties> {
    onclick() {
        this.properties.viewModel.onclick();
    }
    onchange(event: Event) {
        this.properties.viewModel.value = (event.target as HTMLInputElement).value;
    }
    render() {
        return (
            <Child
                viewModel={this.properties.viewModel}
                onclick={this.onclick.bind(this)}
                onchange={this.onchange.bind(this)}
                />
        );
    }
}

interface IChildProperties {
    onclick: Function;
    onchange: Function;
    viewModel: ViewModel;
}

class Child extends Component<IChildProperties> {
    render() {
        return (
            <div>
                <input id="test9-input" type="text" value={this.properties.viewModel.value} onchange={this.properties.onchange} />
                <button id="test9-button" onclick={this.properties.onclick}>Click</button>
            </div>
        );
    }
}

describe('Component', function() {
    it('should attach events to DOM elements', function() {
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        //document.body.appendChild(container);
        Cascade.render(container, <Parent viewModel={viewModel} />);
        var inputElement = container.querySelector('#test9-input') as HTMLInputElement;
        var buttonElement = container.querySelector('#test9-button') as HTMLButtonElement;
        inputElement.value = '1234';
        var event = document.createEvent('Event');
        event.initEvent('change', true, true);
        inputElement.dispatchEvent(event);
        buttonElement.click();
        expect(viewModel.clicked).to.equal(1);
        expect(viewModel.clickedValue).to.equal('1234');
    });
});
