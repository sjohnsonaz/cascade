import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

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
            constructor(props: IProps) {
                super(props);
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
                )
            }
        }

        class Child extends Component<IProps> {
            constructor(props: IProps) {
                super(props);
                childCount++;
            }
            render() {
                childRenderCount++;
                let { viewModel } = this.props;
                let children = this.props.children.map(child => <li>{child}</li>);
                if (viewModel.reverse) {
                    children.reverse();
                }
                return (
                    <ul>
                        {children}
                    </ul>
                );
            }
        }

        class InjectedChild extends Component<IProps> {
            constructor(props: IProps) {
                super(props);
                injectedChildCount++;
            }
            render() {
                injectedChildRenderCount++;
                return <span>{this.props.children}</span>
            }
        }

        let viewModel = new ViewModel();
        var root = (
            <Parent viewModel={viewModel} />
        );

        var container = document.createElement('div');
        Cascade.render(container, root);

        expect(container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).to.equal('1');

        viewModel.reverse = true;
        await Cascade.track(viewModel, 'reverse');

        expect(container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).to.equal('2');

        viewModel.value = true;
        await Cascade.track(viewModel, 'value');

        expect(container.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).to.equal('2');

        // Parent should construct once and render once
        expect(parentCount).to.equal(1);
        expect(parentRenderCount).to.equal(1);

        // Child should construct once and render twice
        expect(childCount).to.equal(1);
        expect(childRenderCount).to.equal(2);

        // Two InjectedChild should each construct once and render once
        expect(injectedChildCount).to.equal(2);
        expect(injectedChildRenderCount).to.equal(2);
    });
});