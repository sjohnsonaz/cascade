import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

describe('Component.diff', () => {
    it('should update nested roots', (done) => {
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
});
