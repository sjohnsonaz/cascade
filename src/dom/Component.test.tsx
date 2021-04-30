import 'reflect-metadata';

import Cascade from '../cascade/Cascade';
import { observable } from '../cascade/Decorators';

import { wait } from '../util/PromiseUtil';

import { Component } from './Component';

describe('Component.toNode', function () {
    it('should render a Node', function () {
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
            <CustomComponent id="child" info="test">
                text
            </CustomComponent>
        );

        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect(element.textContent).toBe('Custom Component - test');
    });

    it('should render falsy values', () => {
        interface ICustomComponentProps {}

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return <div>{this.children}</div>;
            }
        }

        var root = <CustomComponent>0</CustomComponent>;

        let element = Cascade.render(document.createElement('div'), root) as HTMLElement;
        expect((element.childNodes[0] as Text).data).toBe('0');
    });

    it('should render object values', async () => {
        class ViewModel {
            @observable values: any[] = [];
        }

        interface ICustomComponentProps {
            viewModel: ViewModel;
        }

        class CustomComponent extends Component<ICustomComponentProps> {
            render() {
                return (
                    <ul>
                        {this.props.viewModel.values.map((value) => {
                            return value;
                        })}
                    </ul>
                );
            }
        }

        var viewModel = new ViewModel();

        var root = <CustomComponent viewModel={viewModel}></CustomComponent>;
        var element = document.createElement('div');
        Cascade.render(element, root);
        await wait(0);
        viewModel.values.push(1);
        await wait(0);
        viewModel.values.push(null);
        await wait(0);
        viewModel.values.push(2);
        await wait(0);
        viewModel.values.push({});
        await wait(0);
        viewModel.values.push(3);
        await wait(0);
        viewModel.values.push(undefined);
        await wait(20);
        viewModel.values.push(4);
        await wait(0);
        expect(element.childNodes[0].childNodes.length).toBe(5);
    });

    it('should pass children directly into high order Components', () => {
        let length: number = undefined;
        class Child extends Component<any> {
            render() {
                length = this.children.length;
                return <div>this.children</div>;
            }
        }
        class Parent extends Component<any> {
            render() {
                return <Child>{this.children}</Child>;
            }
        }
        class View extends Component<any> {
            render() {
                return (
                    <Parent>
                        <div>0</div>
                        <div>1</div>
                        <div>2</div>
                    </Parent>
                );
            }
        }

        var root = <View />;

        var container = document.createElement('div');

        Cascade.render(container, root);
        expect(length).toBe(3);
    });
});
