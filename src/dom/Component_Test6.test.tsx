import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { Component } from './Component';

class ViewModel {
    clicked: number = 0;
    clickedValue: string = '';
    @observable value: string = '';
    onclick() {
        this.clicked++;
        this.clickedValue = this.value;
    }
}

interface IParentProps {
    viewModel: ViewModel;
}

class Parent extends Component<IParentProps> {
    onclick() {
        this.props.viewModel.onclick();
    }
    onchange(event: Event) {
        this.props.viewModel.value = (event.target as HTMLInputElement).value;
    }
    render() {
        return (
            <Child
                viewModel={this.props.viewModel}
                onclick={this.onclick.bind(this)}
                onchange={this.onchange.bind(this)}
            />
        );
    }
}

interface IChildProps {
    onclick: () => void;
    onchange: () => void;
    viewModel: ViewModel;
}

class Child extends Component<IChildProps> {
    render() {
        return (
            <div>
                <input
                    id="test9-input"
                    type="text"
                    value={this.props.viewModel.value}
                    onchange={this.props.onchange}
                />
                <button id="test9-button" onclick={this.props.onclick}>
                    Click
                </button>
            </div>
        );
    }
}

describe('Component', function () {
    it('should attach events to DOM elements', function () {
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
        expect(viewModel.clicked).toBe(1);
        expect(viewModel.clickedValue).toBe('1234');
    });
});
