import { expect } from 'chai';

import Cascade, { VirtualNode, Component } from '../scripts/modules/Cascade';

describe('VirtualNode.toNode', function () {
    it('should render a Node', function () {
        var root = new VirtualNode('div', {}, 'text');
        var node = root.toNode();
        expect(node.textContent).to.equal('text');
    });

    it('should render recursively', function () {
        var root = new VirtualNode('div', { id: 'parent' },
            new VirtualNode('span', { id: 'child' })
        );
        var node = root.toNode();
        var child = node.querySelector('#child');
        expect(!!child).to.equal(true);
    });

    it('should render with JSX', function () {
        var root = (
            <div id="parent">
                <span id="child">text</span>
            </div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            var child = element.querySelector('#child');
            expect(!!child).to.equal(true);
        });
    });

    it('should render falsy values', () => {
        var root = (
            <div id="parent">{0}</div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect((element.childNodes[0] as Text).data).to.equal('0');
        });
    });

    it('should render Components', function () {
        interface ICustomComponentProps {
            id: string;
            info: string;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <div id={this.props.id}>Custom Component - {this.props.info}</div>
                )
            }
        }

        var root = (
            <div id="parent">
                <CustomComponent id="child" info="test">text</CustomComponent>
            </div>
        );

        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            var child = element.querySelector('#child');
            expect(child.textContent).to.equal('Custom Component - test');
        });
    });
});
