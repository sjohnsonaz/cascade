import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

describe('Component.diff', () => {
    it.skip('should update nested roots', async () => {
        class ViewModel {
            @observable value = false;
        }
        class Content extends Component<IViewProps> {
            render() {
                return this.props.viewModel.value ? null : true;
            }
        }
        interface IViewProps {
            viewModel?: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content viewModel={viewModel} />;
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(200);

        expect(container.textContent).toBe('');
    });

    it('should update nested roots', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IViewProps {
            viewModel?: ViewModel;
        }
        class Content extends Component<IViewProps> {
            render() {
                return this.props.viewModel.value ? true : null;
            }
        }
        class Container extends Component<IViewProps> {
            render() {
                return (
                    <section>
                        <header>Header</header>
                        <div>{this.children}</div>
                    </section>
                );
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <Container>
                        <Content viewModel={viewModel} />
                    </Container>
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div');
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(20);

        expect(container.childNodes[0].childNodes[1].textContent).toBe('true');
    });

    it('should update empty nested Components', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IContentProps {
            value: boolean;
        }
        class Content extends Component<IContentProps> {
            render() {
                return this.props.value ? true : null;
            }
        }
        interface IViewProps {
            viewModel: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content value={viewModel.value} />;
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        // Change the value
        let result = Cascade.set(viewModel, 'value', true);

        // Inspect immediately
        expect(container.childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);

        // Wait for propagation
        await result;

        // Inspect again
        expect(container.childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.TEXT_NODE);

        // Change the value and wait
        await Cascade.set(viewModel, 'value', false);

        // Inspect again
        expect(container.childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    });

    it('should update empty Components', async () => {
        class ViewModel {
            @observable value = false;
        }
        interface IContentProps {
            value: boolean;
        }
        class Content extends Component<IContentProps> {
            render() {
                return this.props.value ? true : null;
            }
        }
        interface IViewProps {
            viewModel: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>
                        <Content value={viewModel.value} />
                    </div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        // Change the value
        let result = Cascade.set(viewModel, 'value', true);

        // Inspect immediately
        expect(container.childNodes[0].childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).toBe(
            Node.COMMENT_NODE,
        );

        // Wait for propagation
        await result;

        // Inspect again
        expect(container.childNodes[0].childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).toBe(Node.TEXT_NODE);

        // Change the value and wait
        await Cascade.set(viewModel, 'value', false);

        // Inspect again
        expect(container.childNodes[0].childNodes[0].childNodes.length).toBe(1);
        expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).toBe(
            Node.COMMENT_NODE,
        );
    });

    it('should delete null values', async () => {
        class ViewModel {
            @observable nonNull = 'nonNull';
            @observable nonUndefined = 'nonUndefined';
        }

        interface IViewProps {
            viewModel: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return <div className={viewModel.nonNull} id={viewModel.nonUndefined}></div>;
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        viewModel.nonNull = null;
        viewModel.nonUndefined = undefined;

        await wait(20);

        let div = container.childNodes[0].childNodes[0] as HTMLElement;
        expect(div.className).not.toBe('nonNull');
        expect(div.id).not.toBe('nonUndefined');
        expect(div.className).not.toBe('null');
        expect(div.id).not.toBe('undefined');
    });

    it('should handle new child Components', async () => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return <div id="static">static child</div>;
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return <div id="dynamic">dynamic child</div>;
            }
        }
        interface IParentProps {
            viewModel: ViewModel;
        }
        class Parent extends Component<IParentProps> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div id="parent">
                        <StaticChild />
                        {viewModel.visible ? <DynamicChild /> : undefined}
                    </div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        await wait(0);

        viewModel.visible = true;

        await wait(20);

        let divRoot = container.childNodes[0] as HTMLElement;
        let divParent = divRoot.childNodes[0] as HTMLElement;
        let divStatic = divParent.childNodes[0] as HTMLElement;
        let divDynamic = divParent.childNodes[1] as HTMLElement;
        expect(divStatic).toBeDefined();
        expect(divDynamic).toBeDefined();
        if (divDynamic) {
            expect(divDynamic.id).toBe('dynamic');
        }
    });

    it('should handle change from null child Components', async () => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return <div id="static">static child</div>;
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return <div id="dynamic">dynamic child</div>;
            }
        }
        interface IParentProps {
            viewModel: ViewModel;
        }
        class Parent extends Component<IParentProps> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div id="parent">
                        <StaticChild />
                        {viewModel.visible ? <DynamicChild /> : null}
                    </div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        await wait(0);

        viewModel.visible = true;

        await wait(20);

        let divRoot = container.childNodes[0] as HTMLElement;
        let divParent = divRoot.childNodes[0] as HTMLElement;
        let divStatic = divParent.childNodes[0] as HTMLElement;
        let divDynamic = divParent.childNodes[1] as HTMLElement;
        expect(divStatic).toBeDefined();
        expect(divDynamic).toBeDefined();
        if (divDynamic) {
            expect(divDynamic.id).toBe('dynamic');
        }
    });

    it('should handle change to null child Components', async () => {
        class ViewModel {
            @observable visible: boolean = true;
        }
        class StaticChild extends Component<any> {
            render() {
                return <div id="static">static child</div>;
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return <div id="dynamic">dynamic child</div>;
            }
        }
        interface IParentProps {
            viewModel: ViewModel;
        }
        class Parent extends Component<IParentProps> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div id="parent">
                        <StaticChild />
                        {viewModel.visible ? <DynamicChild /> : null}
                    </div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        await wait(0);

        viewModel.visible = false;

        await wait(20);

        let divRoot = container.childNodes[0] as HTMLElement;
        let divParent = divRoot.childNodes[0] as HTMLElement;
        let divStatic = divParent.childNodes[0] as HTMLElement;
        let divDynamic = divParent.childNodes[1] as HTMLElement;
        expect(divStatic).toBeDefined();
        expect(divDynamic).toBeUndefined();
    });

    it('should handle change null to null', async () => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return <div id="static">static child</div>;
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return <div id="dynamic">dynamic child</div>;
            }
        }
        interface IParentProps {
            viewModel: ViewModel;
        }
        class Parent extends Component<IParentProps> {
            render() {
                let { viewModel } = this.props;
                return (
                    <div id="parent">
                        <StaticChild />
                        {viewModel.visible ? null : null}
                    </div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);

        await wait(0);

        viewModel.visible = true;

        await wait(20);

        let divRoot = container.childNodes[0] as HTMLElement;
        let divParent = divRoot.childNodes[0] as HTMLElement;
        let divStatic = divParent.childNodes[0] as HTMLElement;
        let divDynamic = divParent.childNodes[1] as HTMLElement;
        expect(divStatic).toBeDefined();
        expect(divDynamic).toBeUndefined();
    });
});
