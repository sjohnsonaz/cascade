import Cascade from './Cascade';

import { wait } from '../util/PromiseUtil';

import { Component } from '../dom/Component';
import Ref from '../dom/Ref';

import { observable } from './Decorators';

describe('Cascade', function () {
    describe('render', function () {
        it('should render VirtualNodes', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return <div>test</div>;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].textContent).toBe('test');
        });

        it('should render strings', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return 'test';
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('test');
        });

        it('should render numbers', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return 0;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('0');
        });

        it('should render true', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return true;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('true');
        });

        it('should render false', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return false;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('false');
        });

        it('should render arrays', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return [1, 2, 3];
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('1,2,3');
        });

        it('should render objects', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render() {
                    return {
                        toString: function () {
                            return 'a, b, c';
                        },
                    };
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('a, b, c');
        });

        it('should not render undefined', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render(): JSX.Element {
                    return undefined;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
        });

        it('should not render null', function () {
            interface IViewProps {}
            class View extends Component<IViewProps> {
                render(): JSX.Element {
                    return null;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
        });

        it('should render nested VirtualNodes', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return <div>test</div>;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].textContent).toBe('test');
        });

        it('should render nested strings', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return 'test';
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('test');
        });

        it('should render nested numbers', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return 0;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('0');
        });

        it('should render nested true', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return true;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('true');
        });

        it('should render nested false', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return false;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('false');
        });

        it('should render nested arrays', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return [1, 2, 3];
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('1,2,3');
        });

        it('should render nested objects', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render() {
                    return {
                        test: 'test',
                        toString: function () {
                            return 'a, b, c';
                        },
                    };
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect((container.childNodes[0] as Text).data).toBe('a, b, c');
        });

        it('should not render nested null', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render(): JSX.Element {
                    return null;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
        });

        it('should not render nested undefined', function () {
            interface IViewProps {}
            class Content extends Component<IViewProps> {
                render(): JSX.Element {
                    return undefined;
                }
            }
            class View extends Component<IViewProps> {
                render() {
                    return <Content />;
                }
            }
            var container = document.createElement('div');
            Cascade.render(container, <View />);
            expect(container.childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
        });

        it('should use beforeRender', async function () {
            class ViewModel {
                @observable value: boolean = false;
            }

            let beforeRenderCount = 0;
            interface IViewProps {
                viewModel: ViewModel;
            }
            class View extends Component<IViewProps> {
                beforeRender() {
                    beforeRenderCount++;
                }
                render() {
                    let { viewModel } = this.props;
                    return <div>{viewModel.value}</div>;
                }
            }
            var container = document.createElement('div');
            var viewModel = new ViewModel();
            Cascade.render(container, <View viewModel={viewModel} />);

            await wait(0);

            viewModel.value = true;

            await wait(0);

            expect(beforeRenderCount).toBe(2);
        });

        it('should use afterRender and callback ref', function () {
            class ViewModel {
                parentNode: Node;
                childNode: Node;
                afterRenderNode: Node;
                parentRef = (node: Node) => {
                    this.parentNode = node;
                };
                childRef = (node: Node) => {
                    this.childNode = node;
                };
            }

            interface IParentProps {
                viewModel: ViewModel;
            }

            class Parent extends Component<IParentProps> {
                afterRender(node: Node) {
                    viewModel.afterRenderNode = node;
                }

                render() {
                    let { viewModel } = this.props;
                    return (
                        <div>
                            <span ref={viewModel.childRef}>Text</span>
                        </div>
                    );
                }
            }

            var viewModel = new ViewModel();
            var container = document.createElement('div');
            var root = (
                <div>
                    <Parent viewModel={viewModel} ref={viewModel.parentRef} />
                </div>
            );
            Cascade.render(container, root);
            expect((viewModel.afterRenderNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.parentNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.childNode as HTMLElement).tagName).toBe('SPAN');
        });

        it('should use afterRender and callback ref after update', async function () {
            class ViewModel {
                parentNode: Node;
                childNode: Node;
                afterRenderNode: Node;
                @observable value = 1;
                parentRef = (node: Node) => {
                    this.parentNode = node;
                };
                childRef = (node: Node) => {
                    this.childNode = node;
                };
            }

            interface IParentProps {
                viewModel: ViewModel;
            }

            class Parent extends Component<IParentProps> {
                afterRender(node: Node) {
                    viewModel.afterRenderNode = node;
                }

                render() {
                    let { viewModel } = this.props;
                    return (
                        <div>
                            <span ref={viewModel.childRef}>Text</span>
                            <span>{viewModel.value}</span>
                        </div>
                    );
                }
            }

            var viewModel = new ViewModel();
            var container = document.createElement('div');
            var root = (
                <div>
                    <Parent viewModel={viewModel} ref={viewModel.parentRef} />
                </div>
            );
            Cascade.render(container, root);
            viewModel.afterRenderNode = undefined;
            viewModel.parentNode = undefined;
            viewModel.childNode = undefined;
            viewModel.value = 2;

            await wait(20);

            expect((viewModel.afterRenderNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.parentNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.childNode as HTMLElement).tagName).toBe('SPAN');
        });

        it('should use afterRender and ref', function () {
            class ViewModel {
                afterRenderNode: Node;
                parentRef = new Ref();
                childRef = new Ref();
            }

            interface IParentProps {
                viewModel: ViewModel;
            }

            class Parent extends Component<IParentProps> {
                afterRender(node: Node) {
                    viewModel.afterRenderNode = node;
                }

                render() {
                    let { viewModel } = this.props;
                    return (
                        <div>
                            <span ref={viewModel.childRef}>Text</span>
                        </div>
                    );
                }
            }

            var viewModel = new ViewModel();
            var container = document.createElement('div');
            var root = (
                <div>
                    <Parent viewModel={viewModel} ref={viewModel.parentRef} />
                </div>
            );
            Cascade.render(container, root);
            expect((viewModel.afterRenderNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.parentRef.current as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.childRef.current as HTMLElement).tagName).toBe('SPAN');
        });

        it('should use afterRender and ref after update', async function () {
            class ViewModel {
                afterRenderNode: Node;
                @observable value = 1;
                parentRef = new Ref();
                childRef = new Ref();
            }

            interface IParentProps {
                viewModel: ViewModel;
            }

            class Parent extends Component<IParentProps> {
                afterRender(node: Node) {
                    viewModel.afterRenderNode = node;
                }

                render() {
                    let { viewModel } = this.props;
                    return (
                        <div>
                            <span ref={viewModel.childRef}>Text</span>
                            <span>{viewModel.value}</span>
                        </div>
                    );
                }
            }

            var viewModel = new ViewModel();
            var container = document.createElement('div');
            var root = (
                <div>
                    <Parent viewModel={viewModel} ref={viewModel.parentRef} />
                </div>
            );
            Cascade.render(container, root);
            viewModel.afterRenderNode = undefined;
            viewModel.parentRef.current = undefined;
            viewModel.childRef.current = undefined;
            viewModel.value = 2;

            await wait(20);

            expect((viewModel.afterRenderNode as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.parentRef.current as HTMLElement).tagName).toBe('DIV');
            expect((viewModel.childRef.current as HTMLElement).tagName).toBe('SPAN');
        });
    });
});
