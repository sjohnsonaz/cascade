import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { Component } from './Component';

describe('Component.diff Nested Children', () => {
    it('should update around injected children', async () => {
        class ViewModel {
            @observable reverse: boolean = false;
            @observable value: boolean = false;
        }

        let parentCount = 0;
        let parentRenderCount = 0;

        let childCount = 0;
        let childRenderCount = 0;

        let injectedChildCount = 0;
        let injectedChildRenderCount = 0;

        interface IProps {
            viewModel: ViewModel;
        }

        class Parent extends Component<IProps> {
            constructor(props: IProps, children: any[]) {
                super(props, children);
                parentCount++;
            }
            render() {
                parentRenderCount++;
                let { viewModel } = this.props;
                return (
                    <div>
                        <Child viewModel={viewModel}>
                            <InjectedChild viewModel={viewModel}>1</InjectedChild>
                            <InjectedChild viewModel={viewModel}>2</InjectedChild>
                        </Child>
                    </div>
                );
            }
        }

        class Child extends Component<IProps> {
            constructor(props: IProps, children: any[]) {
                super(props, children);
                childCount++;
            }
            render() {
                childRenderCount++;
                let { viewModel } = this.props;
                let children = this.children.map((child) => <li>{child}</li>);
                if (viewModel.reverse) {
                    children.reverse();
                }
                return <ul>{children}</ul>;
            }
        }

        class InjectedChild extends Component<IProps> {
            constructor(props: IProps, children: any[]) {
                super(props, children);
                injectedChildCount++;
            }
            render() {
                injectedChildRenderCount++;
                return <span>{this.children}</span>;
            }
        }

        let viewModel = new ViewModel();
        var root = <Parent viewModel={viewModel} />;

        var container = document.createElement('div');
        Cascade.render(container, root);

        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
                .textContent,
        ).toBe('1');

        viewModel.reverse = true;
        await Cascade.track(viewModel, 'reverse');

        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
                .textContent,
        ).toBe('2');

        viewModel.value = true;
        await Cascade.track(viewModel, 'value');

        expect(
            container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
                .textContent,
        ).toBe('2');

        // Parent should construct once and render once
        expect(parentCount).toBe(1);
        expect(parentRenderCount).toBe(1);

        // Child should construct once and render twice
        expect(childCount).toBe(1);
        expect(childRenderCount).toBe(2);

        // Two InjectedChild should each construct once and render once
        expect(injectedChildCount).toBe(2);
        expect(injectedChildRenderCount).toBe(2);
    });

    it('should update around wrapped injected children', async () => {
        class ViewModel {
            @observable columns: number = 3;
        }

        interface IProps {
            viewModel: ViewModel;
        }

        class View extends Component<IProps> {
            render() {
                let { viewModel } = this.props;

                return (
                    <Parent viewModel={viewModel}>
                        <Child viewModel={viewModel} key="child_0" />
                        <Child viewModel={viewModel} key="child_1" />
                        <Child viewModel={viewModel} key="child_2" />
                        <Child viewModel={viewModel} key="child_3" />
                        <Child viewModel={viewModel} key="child_4" />
                        <Child viewModel={viewModel} key="child_5" />
                    </Parent>
                );
            }
        }

        class Parent extends Component<IProps> {
            render() {
                let { viewModel } = this.props;

                let wrappedChildren: any[][] = [];

                let innerWrapper: any[];
                let columns = viewModel.columns;
                this.children.forEach((child, index) => {
                    if (index % columns === 0) {
                        innerWrapper = [];
                        wrappedChildren.push(innerWrapper);
                    }
                    innerWrapper.push(child);
                });

                return (
                    <div>
                        {wrappedChildren.map((children, index) => {
                            return (
                                <Wrapper viewModel={viewModel} key={index}>
                                    {children}
                                </Wrapper>
                            );
                        })}
                    </div>
                );
            }
        }

        class Container extends Component<IProps> {
            render() {
                return <ul>{this.children}</ul>;
            }
        }

        class Wrapper extends Component<IProps> {
            render() {
                return <li>{this.children}</li>;
            }
        }

        class Child extends Component<IProps> {
            render() {
                return <span>{this.children}</span>;
            }
        }

        let viewModel = new ViewModel();
        var root = <View viewModel={viewModel} />;

        var container = document.createElement('div');
        Cascade.render(container, root);

        // console.log(container);

        expect(container.childNodes[0].childNodes.length).toBe(2);
        expect(container.childNodes[0].childNodes[0].childNodes.length).toBe(3);
        expect(container.childNodes[0].childNodes[1].childNodes.length).toBe(3);

        viewModel.columns = 2;
        await Cascade.track(viewModel, 'columns');

        // console.log(container);

        expect(container.childNodes[0].childNodes.length).toBe(3);
        expect(container.childNodes[0].childNodes[0].childNodes.length).toBe(2);
        expect(container.childNodes[0].childNodes[1].childNodes.length).toBe(2);
    });
});
