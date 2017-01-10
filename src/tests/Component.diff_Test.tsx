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

    it.skip('should update nested roots', (done) => {
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
});
