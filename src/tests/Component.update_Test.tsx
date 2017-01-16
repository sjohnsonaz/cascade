import { expect } from 'chai';

import Cascade, { Component, observable } from '../scripts/modules/Cascade';

describe('Component.update', () => {
    it('should update from inherited observables', (done) => {
        class Parent {
            @observable parentValue: number = 0;
        }

        class Child extends Parent {
            @observable childValue: number = 10;
        }

        interface IViewProps {
            child: Child;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>{this.props.child.parentValue}</div>
                );
            }
        }
        var child = new Child();
        var root = (
            <div>
                <View child={child} />
            </div>
        );

        var container = document.createElement('div');
        Cascade.render(container, root);
        child.parentValue = 1;
        window.setTimeout(() => {
            expect(container.childNodes[0].childNodes[0].textContent).to.equal('1');
            done();
        }, 20);
    });

    it('should update from inherited abstract observables', (done) => {
        abstract class Parent {
            @observable parentValue: number = 0;
            abstract init();
        }

        class Child extends Parent {
            @observable childValue: number = 10;
            init() {

            }
        }

        interface IViewProps {
            child: Child;
        }

        class View extends Component<IViewProps> {
            render() {
                return (
                    <div>{this.props.child.parentValue}</div>
                );
            }
        }
        var child = new Child();
        var root = (
            <div>
                <View child={child} />
            </div>
        );

        var container = document.createElement('div');
        Cascade.render(container, root);
        child.parentValue = 1;
        window.setTimeout(() => {
            expect(container.childNodes[0].childNodes[0].textContent).to.equal('1');
            done();
        }, 20);
    });
});
