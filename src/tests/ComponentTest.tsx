import { expect } from 'chai';

import Cascade, { VirtualNode, Component } from '../scripts/modules/Cascade';

describe('Component.toNode', function () {
    it('should render a Node', function () {
        interface ICustomComponentProps {
            id: string;
            info: string;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <div id={this.props.id}>Custom Component - {this.props.info}</div>
                );
            }
        }

        var root = (
            <CustomComponent id="child" info="test">text</CustomComponent>
        );

        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.textContent).to.equal('Custom Component - test');
        });
    });

    it('should render falsy values', () => {
        interface ICustomComponentProps {

        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <div>{this.children}</div>
                );
            }
        }

        var root = (
            <CustomComponent>0</CustomComponent>
        );

        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect((element.childNodes[0] as Text).data).to.equal('0');
        });
    });
});