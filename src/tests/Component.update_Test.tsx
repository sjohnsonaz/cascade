import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

describe('Component.update', () => {
    it('should store old props in Component.prevProps', async () => {
        class ViewModel {
            @observable value: boolean = false;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Child value={this.props.viewModel.value} />
                );
            }
        }

        interface IChildProps {
            value: boolean;
        }
        let runCount = 0;
        class Child extends Component<IChildProps> {
            render() {
                switch (runCount) {
                    case 0:
                        expect(this.prevProps).to.be.undefined;
                        expect(this.props.value).to.equal(false);
                        break;
                    case 1:
                        expect(this.prevProps.value).to.equal(false);
                        expect(this.props.value).to.equal(true);
                        break;
                }
                runCount++;
                return (
                    <div>{this.props.value}</div>
                );
            }
        }

        let viewModel = new ViewModel();
        let container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(20);

        expect(runCount).to.equal(2);
    });

    it('should update from inherited observables', async () => {
        class Parent {
            @observable parentValue: number = 0;
        }

        class Child extends Parent {
            @observable childValue: number = 10;
        }

        interface IViewProps {
            child: Child;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>{this.props.child.parentValue}</div>
                );
            }
        }
        var child = new Child();
        var root = (
            <div>
                <View child={child} />
            </div>
        );

        var container = document.createElement('div');
        Cascade.render(container, root);
        child.parentValue = 1;

        await wait(20);

        expect(container.childNodes[0].childNodes[0].textContent).to.equal('1');
    });

    it('should update from inherited abstract observables', async () => {
        abstract class Parent {
            @observable parentValue: number = 0;
            abstract init(): void;
        }

        class Child extends Parent {
            @observable childValue: number = 10;
            init() {

            }
        }

        interface IViewProps {
            child: Child;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>{this.props.child.parentValue}</div>
                );
            }
        }
        var child = new Child();
        var root = (
            <div>
                <View child={child} />
            </div>
        );

        var container = document.createElement('div');
        Cascade.render(container, root);
        child.parentValue = 1;

        await wait(20);

        expect(container.childNodes[0].childNodes[0].textContent).to.equal('1');
    });

    it('should update nested Components', async () => {
        class ViewModel {
            @observable valueA: string = 'value A';
            @observable valueB: string = 'value B';
            @observable valueC: string = 'value C';
        }

        class View extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div key="view">
                        <Parent viewModel={viewModel} />
                        <div>{viewModel.valueA}</div>
                    </div>
                )
            }
        }

        class Parent extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div key="parent">
                        <Child viewModel={viewModel} />
                        <div>{viewModel.valueB}</div>
                    </div>
                )
            }
        }

        let childRenderCount = 0;
        class Child extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                childRenderCount++;
                let { viewModel } = this.props;
                return (
                    <div key="child">{viewModel.valueC}</div>
                )
            }
        }

        let viewModel = new ViewModel();

        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );

        var container = document.createElement('div');
        Cascade.render(container, root);

        await wait(0);

        viewModel.valueA = 'new value A';

        await wait(0);

        viewModel.valueB = 'new value B';

        await wait(0);

        viewModel.valueC = 'new value C';

        await wait(20);
        expect(container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.length).to.equal(1);
        expect(container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).to.equal('new value C');
        expect(childRenderCount).to.equal(4);
    });
});