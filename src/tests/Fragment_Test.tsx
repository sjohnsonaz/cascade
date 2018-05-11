import { expect } from 'chai';

import Cascade, { VirtualNode, Component, observable } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

describe('Fragment.toNode', function () {
    it('should render Fragment Nodes', () => {
        var root = (
            <>
                <div id="testId"></div>
            </>
        );
        let rootElement = document.createElement('div');
        Cascade.render(rootElement, root, function (element: HTMLElement) {
            let div: HTMLElement = rootElement.childNodes[0] as any;
            expect(div.id).to.equal('testId');
        });
    });

    it.skip('should be able to Diff', async () => {
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
                return (
                    <div>c</div>
                );
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return (
                    <span>
                        {this.props.viewModel.value ?
                            <WithoutFragments /> :
                            <WithFragments />
                        }
                    </span>
                );
            }
        }
        var viewModel = new ViewModel();
        var container = document.createElement('div')
        Cascade.render(container, <View viewModel={viewModel} />);
        viewModel.value = true;

        await wait(20);

        let span = container.childNodes[0];
        let div = span.childNodes[0];
        let text = div.textContent;
        expect(span.childNodes.length).to.equal(1);
        expect(div.childNodes.length).to.equal(1);
        expect(text).to.equal('c');
    });
});