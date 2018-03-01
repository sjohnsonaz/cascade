import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

describe('Component.diff', () => {
    it.skip('should update nested roots', (done) => {
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
                return (
                    <Content viewModel={viewModel} />
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div')
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;
        window.setTimeout(() => {
            expect(container.textContent).to.equal('');
            done();
        }, 200);
    });

    it('should update nested roots', (done) => {
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
        var container = document.createElement('div')
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;
        window.setTimeout(() => {
            expect(container.childNodes[0].childNodes[1].textContent).to.equal('true');
            done();
        }, 20);
    });

    it('should update empty nested Components', (done) => {
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
                    <Content value={viewModel.value} />
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        viewModel.value = true;
        expect(container.childNodes[0].childNodes.length).to.equal(1);
        expect(container.childNodes[0].childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
        window.setTimeout(() => {
            expect(container.childNodes[0].childNodes.length).to.equal(1);
            expect(container.childNodes[0].childNodes[0].nodeType).to.equal(Node.TEXT_NODE);
            viewModel.value = false;
            window.setTimeout(() => {
                expect(container.childNodes[0].childNodes.length).to.equal(1);
                expect(container.childNodes[0].childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
                done();
            }, 20);
        }, 20);
    });

    it('should update empty Components', (done) => {
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
        var container = document.createElement('div')
        Cascade.render(container, root);
        viewModel.value = true;
        expect(container.childNodes[0].childNodes[0].childNodes.length).to.equal(1);
        expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
        window.setTimeout(() => {
            expect(container.childNodes[0].childNodes[0].childNodes.length).to.equal(1);
            expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).to.equal(Node.TEXT_NODE);
            viewModel.value = false;
            window.setTimeout(() => {
                expect(container.childNodes[0].childNodes[0].childNodes.length).to.equal(1);
                expect(container.childNodes[0].childNodes[0].childNodes[0].nodeType).to.equal(Node.COMMENT_NODE);
                done();
            }, 20);
        }, 20);
    });

    it('should delete null values', (done) => {
        class ViewModel {
            @observable nonNull = 'nonNull';
            @observable nonUndefined = 'nonUndefined';
        }

        interface IViewProps {
            viewModel: ViewModel;
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <div className={viewModel.nonNull} id={viewModel.nonUndefined}></div>
                );
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div>
                <View viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        viewModel.nonNull = null;
        viewModel.nonUndefined = undefined;
        window.setTimeout(() => {
            let div = container.childNodes[0].childNodes[0] as HTMLElement;
            expect(div.className).to.not.equal('nonNull');
            expect(div.id).to.not.equal('nonUndefined');
            expect(div.className).to.not.equal('null');
            expect(div.id).to.not.equal('undefined');
            done();
        }, 20);
    });

    it('should handle new child Components', (done) => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return (
                    <div id="static">static child</div>
                );
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return (
                    <div id="dynamic">dynamic child</div>
                )
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
                )
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        window.setTimeout(() => {
            viewModel.visible = true;
            window.setTimeout(() => {
                let divRoot = container.childNodes[0] as HTMLElement;
                let divParent = divRoot.childNodes[0] as HTMLElement;
                let divStatic = divParent.childNodes[0] as HTMLElement;
                let divDynamic = divParent.childNodes[1] as HTMLElement;
                expect(divStatic).to.not.be.undefined;
                expect(divDynamic).to.not.be.undefined;
                if (divDynamic) {
                    expect(divDynamic.id).to.equal('dynamic');
                }
                done();
            }, 20);
        })
    });

    it('should handle change from null child Components', (done) => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return (
                    <div id="static">static child</div>
                );
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return (
                    <div id="dynamic">dynamic child</div>
                )
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
                )
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        window.setTimeout(() => {
            viewModel.visible = true;
            window.setTimeout(() => {
                let divRoot = container.childNodes[0] as HTMLElement;
                let divParent = divRoot.childNodes[0] as HTMLElement;
                let divStatic = divParent.childNodes[0] as HTMLElement;
                let divDynamic = divParent.childNodes[1] as HTMLElement;
                expect(divStatic).to.not.be.undefined;
                expect(divDynamic).to.not.be.undefined;
                if (divDynamic) {
                    expect(divDynamic.id).to.equal('dynamic');
                }
                done();
            }, 20);
        })
    });

    it('should handle change to null child Components', (done) => {
        class ViewModel {
            @observable visible: boolean = true;
        }
        class StaticChild extends Component<any> {
            render() {
                return (
                    <div id="static">static child</div>
                );
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return (
                    <div id="dynamic">dynamic child</div>
                )
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
                )
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        window.setTimeout(() => {
            viewModel.visible = false;
            window.setTimeout(() => {
                let divRoot = container.childNodes[0] as HTMLElement;
                let divParent = divRoot.childNodes[0] as HTMLElement;
                let divStatic = divParent.childNodes[0] as HTMLElement;
                let divDynamic = divParent.childNodes[1] as HTMLElement;
                expect(divStatic).to.not.be.undefined;
                expect(divDynamic).to.be.undefined;
                done();
            }, 20);
        })
    });


    it('should handle change null to null', (done) => {
        class ViewModel {
            @observable visible: boolean = false;
        }
        class StaticChild extends Component<any> {
            render() {
                return (
                    <div id="static">static child</div>
                );
            }
        }
        class DynamicChild extends Component<any> {
            render() {
                return (
                    <div id="dynamic">dynamic child</div>
                )
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
                )
            }
        }
        var viewModel = new ViewModel();
        var root = (
            <div id="root">
                <Parent viewModel={viewModel} />
            </div>
        );
        var container = document.createElement('div')
        Cascade.render(container, root);
        window.setTimeout(() => {
            viewModel.visible = true;
            window.setTimeout(() => {
                let divRoot = container.childNodes[0] as HTMLElement;
                let divParent = divRoot.childNodes[0] as HTMLElement;
                let divStatic = divParent.childNodes[0] as HTMLElement;
                let divDynamic = divParent.childNodes[1] as HTMLElement;
                expect(divStatic).to.not.be.undefined;
                expect(divDynamic).to.be.undefined;
                done();
            }, 20);
        })
    });
});
