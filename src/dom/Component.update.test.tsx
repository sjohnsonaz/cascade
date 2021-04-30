import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

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
                return <Child value={this.props.viewModel.value} />;
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
                        expect(this.prevProps).toBeUndefined();
                        expect(this.props.value).toBe(false);
                        break;
                    case 1:
                        expect(this.prevProps.value).toBe(false);
                        expect(this.props.value).toBe(true);
                        break;
                }
                runCount++;
                return <div>{this.props.value}</div>;
            }
        }

        let viewModel = new ViewModel();
        let container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(20);

        expect(runCount).toBe(2);
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
                return <div>{this.props.child.parentValue}</div>;
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

        expect(container.childNodes[0].childNodes[0].textContent).toBe('1');
    });

    it('should update from inherited abstract observables', async () => {
        abstract class Parent {
            @observable parentValue: number = 0;
            abstract init(): void;
        }

        class Child extends Parent {
            @observable childValue: number = 10;
            init() {}
        }

        interface IViewProps {
            child: Child;
        }

        class View extends Component<IViewProps> {
            render() {
                return <div>{this.props.child.parentValue}</div>;
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

        expect(container.childNodes[0].childNodes[0].textContent).toBe('1');
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
                );
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
                );
            }
        }

        let childRenderCount = 0;
        class Child extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                childRenderCount++;
                let { viewModel } = this.props;
                return <div key="child">{viewModel.valueC}</div>;
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
        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.length,
        ).toBe(1);
        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
                .textContent,
        ).toBe('new value C');
        expect(childRenderCount).toBe(4);
    });

    it('should call afterProps on storeProps', async () => {
        class ViewModel {
            @observable valueA: string = 'value A';
            @observable valueB: string = 'value B';
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
                );
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
                );
            }
        }

        let childRenderCount = 0;
        let childAfterPropsCount = 0;
        class Child extends Component<{
            viewModel: ViewModel;
        }> {
            @observable valueC: string = 'value C';
            beforeRender(mounted: boolean) {
                if (!mounted) {
                    window.setTimeout(() => {
                        this.valueC = 'new value C';
                    });
                }
            }
            afterProps() {
                childAfterPropsCount++;
            }
            render() {
                childRenderCount++;
                return <div key="child">{this.valueC}</div>;
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

        await wait(20);
        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes.length,
        ).toBe(1);
        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
                .textContent,
        ).toBe('new value C');
        expect(childRenderCount).toBe(4);
        expect(childAfterPropsCount).toBe(3);
    });

    it('should update children before attributes', async () => {
        class ViewModel {
            @observable options: number[] = [1, 2, 3];
            @observable value: number = 2;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }

        class View extends Component<IViewProps> {
            render() {
                let { viewModel } = this.props;
                return (
                    <select id="select" value={viewModel.value as any}>
                        {viewModel.options.map((option) => (
                            <option value={option as any}>{option}</option>
                        ))}
                    </select>
                );
            }
        }

        let viewModel = new ViewModel();
        let root = <View viewModel={viewModel} />;
        let select = Cascade.render(document.createElement('div'), root) as HTMLSelectElement;
        expect(select.value).toBe('2');

        viewModel.options.push(4);
        viewModel.value = 4;

        await wait(20);

        expect(select.value).toBe('4');
    });
});
