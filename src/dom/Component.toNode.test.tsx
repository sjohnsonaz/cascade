import Cascade from '../cascade/Cascade';

import { Component } from './Component';

describe('Component.toNode', () => {
    it('should render VirtualNodes', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return <div>test</div>;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].textContent).toBe('test');
    });

    it('should render strings', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return 'test';
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('test');
    });

    it('should render numbers', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return 0;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('0');
    });

    it('should render true', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return true;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('true');
    });

    it('should render false', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return false;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('false');
    });

    it('should render arrays', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return [1, 2, 3];
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('1,2,3');
    });

    it('should render objects', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render() {
                return {
                    toString: function () {
                        return 'a, b, c';
                    },
                };
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('a, b, c');
    });

    it('should not render undefined', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render(): JSX.Element {
                return undefined;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    });

    it('should not render null', () => {
        interface IViewProps {}
        class View extends Component<IViewProps> {
            render(): JSX.Element {
                return null;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    });

    it('should render nested VirtualNodes', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return <div>test</div>;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].textContent).toBe('test');
    });

    it('should render nested strings', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return 'test';
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('test');
    });

    it('should render nested numbers', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return 0;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('0');
    });

    it('should render nested true', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return true;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('true');
    });

    it('should render nested false', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return false;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('false');
    });

    it('should render nested arrays', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return [1, 2, 3];
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('1,2,3');
    });

    it('should render nested objects', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render() {
                return {
                    test: 'test',
                    toString: function () {
                        return 'a, b, c';
                    },
                };
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect((container.childNodes[0].childNodes[0] as Text).data).toBe('a, b, c');
    });

    it('should not render nested null', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render(): JSX.Element {
                return null;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    });

    it('should not render nested undefined', () => {
        interface IViewProps {}
        class Content extends Component<IViewProps> {
            render(): JSX.Element {
                return undefined;
            }
        }
        class View extends Component<IViewProps> {
            render() {
                return <Content />;
            }
        }
        var root = (
            <div>
                <View />
            </div>
        );
        var container = document.createElement('div');
        Cascade.render(container, root);
        expect(container.childNodes[0].childNodes[0].nodeType).toBe(Node.COMMENT_NODE);
    });
});
