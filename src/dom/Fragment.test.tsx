import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

describe('Fragment.toNode', function () {
    it('should render Fragment Nodes', () => {
        var root = (
            <>
                <div id="testId"></div>
            </>
        );
        let rootElement = document.createElement('div');
        let element = Cascade.render(rootElement, root) as HTMLElement;
        let div: HTMLElement = rootElement.childNodes[0] as any;
        expect(div.id).toBe('testId');
    });

    it.skip('should be able to Diff Fragment and Element', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <span>
                        {this.props.viewModel.value ? (
                            <div>c</div>
                        ) : (
                            <>
                                <div>a</div>
                                <div>b</div>
                            </>
                        )}
                    </span>
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;
        await Cascade.track(viewModel, 'value');

        let span = container.childNodes[0];
        expect(span.childNodes.length).toBe(1);
        expect(span.childNodes[0].childNodes.length).toBe(1);
        expect(span.childNodes[0].textContent).toBe('c');

        viewModel.value = false;
        await Cascade.track(viewModel, 'value');

        span = container.childNodes[0];
        expect(span.childNodes.length).toBe(2);
        expect(span.childNodes[0].textContent).toBe('a');
        expect(span.childNodes[1].textContent).toBe('b');
    });

    it.skip('should be able to Diff Fragment and Fragment', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <span>
                        {this.props.viewModel.value ? (
                            <>
                                <div>c</div>
                            </>
                        ) : (
                            <>
                                <div>a</div>
                                <div>b</div>
                            </>
                        )}
                    </span>
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;
        await Cascade.track(viewModel, 'value');

        let span = container.childNodes[0];
        expect(span.childNodes.length).toBe(1);
        expect(span.childNodes[0].childNodes.length).toBe(1);
        expect(span.childNodes[0].textContent).toBe('c');

        viewModel.value = false;
        await Cascade.track(viewModel, 'value');

        span = container.childNodes[0];
        expect(span.childNodes.length).toBe(2);
        expect(span.childNodes[0].textContent).toBe('a');
        expect(span.childNodes[1].textContent).toBe('b');
    });

    it.skip('should be able to Diff root Fragment and Element', async () => {
        class ViewModel {
            @observable value = true;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }

        class View extends Component<IViewProps> {
            render() {
                if (this.props.viewModel.value) {
                    return <div>c</div>;
                } else {
                    return (
                        <>
                            <div>a</div>
                            <div>b</div>
                        </>
                    );
                }
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = false;
        await Cascade.track(viewModel, 'value');

        let span = container.childNodes[0];
        expect(span.childNodes.length).toBe(2);
        expect(span.childNodes[0].textContent).toBe('a');
        expect(span.childNodes[1].textContent).toBe('b');

        viewModel.value = true;
        await Cascade.track(viewModel, 'value');

        span = container.childNodes[0];
        expect(span.childNodes.length).toBe(2);
        expect(span.childNodes[0].textContent).toBe('a');
        expect(span.childNodes[1].textContent).toBe('b');
    });

    it.skip('should be able to Diff nested root Fragment to Element', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IViewProps {
            viewModel: ViewModel;
        }
        class WithFragments extends Component<any> {
            render() {
                return (
                    <>
                        <div>a</div>
                        <div>b</div>
                    </>
                );
            }
        }
        class WithoutFragments extends Component<any> {
            render() {
                return <div>c</div>;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <span>
                        {this.props.viewModel.value ? <WithoutFragments /> : <WithFragments />}
                    </span>
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(20);

        let span = container.childNodes[0];
        let div = span.childNodes[0];
        let text = div.textContent;
        expect(span.childNodes.length).toBe(1);
        expect(div.childNodes.length).toBe(1);
        expect(text).toBe('c');
    });
});
