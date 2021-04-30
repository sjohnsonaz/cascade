import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

describe('Component.dispose', () => {
    it('should dispose of nested Components', async () => {
        class ViewModel {
            @observable valueA: boolean = true;
            @observable valueB: boolean = true;
            @observable valueC: boolean = true;
        }

        let viewDisposed = 0;
        class View extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div key="view">
                        {viewModel.valueA ? (
                            <Parent viewModel={viewModel} />
                        ) : (
                            <div>{viewModel.valueA}</div>
                        )}
                    </div>
                );
            }
            afterDispose() {
                viewDisposed++;
            }
        }

        let parentDisposed = 0;
        class Parent extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div key="parent">
                        {viewModel.valueB ? (
                            <Child viewModel={viewModel} />
                        ) : (
                            <div>{viewModel.valueB}</div>
                        )}
                    </div>
                );
            }
            afterDispose() {
                parentDisposed++;
            }
        }

        let childDisposed = 0;
        class Child extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return <div key="child">{viewModel.valueC}</div>;
            }
            afterDispose() {
                childDisposed++;
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

        viewModel.valueA = false;

        await wait(0);

        viewModel.valueA = true;

        await wait(0);

        viewModel.valueB = false;

        await wait(20);
        expect(viewDisposed).toBe(0);
        expect(parentDisposed).toBe(1);
        expect(childDisposed).toBe(2);
    });

    it('should not dispose of persisted nested Components', async () => {
        class ViewModel {
            @observable valueA: string = 'value A';
            @observable valueB: string = 'value B';
            @observable valueC: string = 'value C';
        }

        let viewDisposed = 0;
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
            afterDispose() {
                viewDisposed++;
            }
        }

        let parentDisposed = 0;
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
            afterDispose() {
                parentDisposed++;
            }
        }

        let childDisposed = 0;
        class Child extends Component<{
            viewModel: ViewModel;
        }> {
            render() {
                let { viewModel } = this.props;
                return <div key="child">{viewModel.valueC}</div>;
            }
            afterDispose() {
                childDisposed++;
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
        expect(viewDisposed).toBe(0);
        expect(parentDisposed).toBe(0);
        expect(childDisposed).toBe(0);
    });
});
