import { expect } from 'chai';

import Cascade, { Component, Portal } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

describe('Component.portal', () => {
    it('should render Components to specified Element', async () => {
        var container = document.createElement('div');
        var portalContainer = document.createElement('div');

        class Parent extends Component<any> {
            render() {
                return (
                    <div><Child /></div>
                );
            }
        }

        class Child extends Component<any> {
            render() {
                return (
                    <Portal element={portalContainer}>
                        <div>Child</div>
                    </Portal>
                );
            }
        }
        var root = (
            <Parent />
        );

        var container = document.createElement('div');
        Cascade.render(container, root);

        expect(container.childNodes[0].textContent).to.equal('');
        expect(portalContainer.childNodes[0].textContent).to.equal('Child');
    });
});