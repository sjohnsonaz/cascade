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

    it('should not render undefined values', () => {
        var root = (
            <div id="parent">{}</div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.childNodes.length).to.equal(0);
        });
    });

    it('should not render null values', () => {
        var root = (
            <div id="parent">{null}</div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.childNodes.length).to.equal(0);
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

    it('should render Object.toString for Object values', () => {
        var object = {
            toString: function () {
                return 'String output'
            }
        };
        var root = (
            <div id="parent">{object}</div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect((element.childNodes[0] as Text).data).to.equal('String output');
        });
    });

    it('should render standard properties', () => {
        var root = (
            <div id="testId"></div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.id).to.equal('testId');
        });
    });

    it('should render standard attributes', () => {
        var root = (
            <div>
                <form id="formId" />
                <input form="formId" />
            </div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect((element.childNodes[1] as HTMLInputElement).getAttribute('form')).to.equal('formId');
        });
    });

    it('should render custom attributes', () => {
        var root = (
            <div data-custom="test value"></div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.getAttribute('data-custom')).to.equal('test value');
        });
    });

    it('should render style attributes', () => {
        var root = (
            <div style="width: 100%"></div>
        );
        Cascade.render(document.createElement('div'), root, function (element: HTMLElement) {
            expect(element.style.width).to.equal('100%');
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
