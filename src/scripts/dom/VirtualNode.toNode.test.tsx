import Cascade from '../cascade/Cascade';

import { Component } from './Component';
import VirtualNode from './VirtualNode';

describe('VirtualNode.toNode', function () {
    it('should render a Node', function () {
        var root = new VirtualNode('div', {}, ['text']);
        var node = root.toNode();
        expect(node.textContent).toBe('text');
    });

    it('should render recursively', function () {
        var root = new VirtualNode('div', { id: 'parent' }, [
            new VirtualNode('span', { id: 'child' }, []),
        ]);
        var node = root.toNode();
        var child = node.querySelector('#child');
        expect(!!child).toBe(true);
    });

    it('should render with JSX', function () {
        var root = (
            <div id="parent">
                <span id="child">text</span>
            </div>
        );
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        var child = element.querySelector('#child');
        expect(!!child).toBe(true);
    });

    it('should not render undefined values', () => {
        var root = <div id="parent">{}</div>;
        let element = Cascade.render(document.createElement('div'), root);
        expect(element.childNodes.length).toBe(0);
    });

    it('should not render null values', () => {
        var root = <div id="parent">{null}</div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.childNodes.length).toBe(0);
    });

    it('should render falsy values', () => {
        var root = <div id="parent">{0}</div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect((element.childNodes[0] as Text).data).toBe('0');
    });

    it('should render Object.toString for Object values', () => {
        var object = {
            toString: function () {
                return 'String output';
            },
        };
        var root = <div id="parent">{object}</div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect((element.childNodes[0] as Text).data).toBe('String output');
    });

    it('should render standard attributes', () => {
        var root = <div id="testId"></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.id).toBe('testId');
    });

    it('should not render undefined attributes', () => {
        var root = <div id={undefined}></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.id).not.toBe('undefined');
    });

    it('should not render null attributes', () => {
        var root = <div id={null}></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.id).not.toBe('null');
    });

    it('should render form attributes', () => {
        var root = (
            <div>
                <form id="formId" />
                <input form="formId" />
            </div>
        );
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect((element.childNodes[1] as HTMLInputElement).getAttribute('form')).toBe('formId');
    });

    it('should render custom attributes', () => {
        var root = <div data-custom="test value"></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.getAttribute('data-custom')).toBe('test value');
    });

    it('should render role attributes', () => {
        var root = <div role="button"></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.getAttribute('role')).toBe('button');
    });

    it('should render aria attributes', () => {
        var root = <div aria-label="test value"></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.getAttribute('aria-label')).toBe('test value');
    });

    it('should render style attribute objects', () => {
        var root = <div style={{ width: '100%' }}></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.style.width).toBe('100%');
    });

    it('should ignore undefined and null properties of style attribute objects', () => {
        var root = (
            <div
                style={
                    {
                        '--test-0': undefined,
                        '--test-1': null,
                    } as any
                }
            ></div>
        );
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.style.getPropertyValue('--test-0')).toBe('');
        expect(element.style.getPropertyValue('--test-1')).toBe('');
    });

    it('should render style attribute strings', () => {
        var root = <div style="width: 100%"></div>;
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.style.width).toBe('100%');
    });

    it('should render event attributes with function references', () => {
        let count = 0;
        var root = (
            <button
                onclick={() => {
                    count++;
                }}
            >
                OK
            </button>
        );
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        element.click();
        expect(count).toBe(1);
    });

    it('should render SVG elements', function () {
        if (typeof SVGElement === 'undefined') this.skip();
        var root = (
            <svg height="210" width="400" xmlns="http://www.w3.org/2000/svg">
                <path d="M 150 0 L 75 200 L 225 200 Z" />
                Sorry, your browser does not support inline SVG.
            </svg>
        );
        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        let path = element.childNodes[0] as SVGElement;
        expect(path.getAttribute('d')).toBe('M 150 0 L 75 200 L 225 200 Z');
    });

    it('should render Components', function () {
        interface ICustomComponentProps {
            id: string;
            info: string;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return <div id={this.props.id}>Custom Component - {this.props.info}</div>;
            }
        }

        var root = (
            <div id="parent">
                <CustomComponent id="child" info="test">
                    text
                </CustomComponent>
            </div>
        );

        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        var child = element.querySelector('#child');
        expect(child.textContent).toBe('Custom Component - test');
    });

    it('should render children before attributes', async () => {
        var root = (
            <select id="select" value="2">
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        );
        let select = Cascade.render(document.createElement('div'), root) as HTMLSelectElement;
        expect(select.value).toBe('2');
    });
});
