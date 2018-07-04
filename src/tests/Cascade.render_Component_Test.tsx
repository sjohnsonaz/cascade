import { expect } from 'chai';

import Cascade, { Component, observable, Ref } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

describe('Cascade.render Component', () => {
    it('should render VirtualNodes', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>test</div>
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].textContent).to.equal('test');
    });

    it('should render strings', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return "test";
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('test');
    });

    it('should render numbers', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return 0;
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('0');
    });

    it('should render true', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return true;
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('true');
    });

    it('should render false', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return false;
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('false');
    });

    it('should render arrays', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return [1, 2, 3];
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('1,2,3');
    });

    it('should render objects', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render() {
                return {
                    toString: function () {
                        return 'a, b, c';
                    }
                };
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('a, b, c');
    });

    it('should not render undefined', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render(): JSX.Element {
                return undefined;
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
    });

    it('should not render null', () => {
        interface IViewProps {
        }
        class View extends Component<IViewProps> {
            render(): JSX.Element {
                return null;
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
    });

    it('should render nested VirtualNodes', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return (
                    <div>test</div>
                );
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].textContent).to.equal('test');
    });

    it('should render nested strings', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return "test";
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('test');
    });

    it('should render nested numbers', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return 0;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('0');
    });

    it('should render nested true', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return true;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('true');
    });

    it('should render nested false', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return false;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('false');
    });

    it('should render nested arrays', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return [1, 2, 3];
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('1,2,3');
    });

    it('should render nested objects', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render() {
                return {
                    test: 'test',
                    toString: function () {
                        return 'a, b, c'
                    }
                };
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect((container.childNodes[0] as Text).data).to.equal('a, b, c');
    });

    it('should not render nested null', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render(): JSX.Element {
                return null;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
    });

    it('should not render nested undefined', () => {
        interface IViewProps {
        }
        class Content extends Component<IViewProps> {
            render(): JSX.Element {
                return undefined;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Content />
                );
            }
        }
        var container = document.createElement('div');
        Cascade.render(container, <View />);
        expect(container.childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
    });

    it('should use beforeRender', async () => {
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
                return (
                    <div>{viewModel.value}</div>
                );
            }
        }
        var container = document.createElement('div');
        var viewModel = new ViewModel();
        Cascade.render(container, <View viewModel={viewModel} />);

        await wait(0);

        viewModel.value = true;

        await wait(0);

        expect(beforeRenderCount).to.equal(2);
    });

    it('should use afterRender and callback ref', () => {
        class ViewModel {
            parentNode: Node;
            childNode: Node;
            afterRenderNode: Node;
            parentRef = (node: Node) => {
                this.parentNode = node;
            }
            childRef = (node: Node) => {
                this.childNode = node;
            }
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
        expect((viewModel.afterRenderNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.parentNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.childNode as HTMLElement).tagName).to.equal('SPAN');
    });

    it('should use afterRender and callback ref after update', async () => {
        class ViewModel {
            parentNode: Node;
            childNode: Node;
            afterRenderNode: Node;
            @observable value = 1;
            parentRef = (node: Node) => {
                this.parentNode = node;
            }
            childRef = (node: Node) => {
                this.childNode = node;
            }
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

        expect((viewModel.afterRenderNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.parentNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.childNode as HTMLElement).tagName).to.equal('SPAN');
    });

    it('should use afterRender and ref', () => {
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
        expect((viewModel.afterRenderNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.parentRef.current as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.childRef.current as HTMLElement).tagName).to.equal('SPAN');
    });

    it('should use afterRender and ref after update', async () => {
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

        expect((viewModel.afterRenderNode as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.parentRef.current as HTMLElement).tagName).to.equal('DIV');
        expect((viewModel.childRef.current as HTMLElement).tagName).to.equal('SPAN');
    });
});
