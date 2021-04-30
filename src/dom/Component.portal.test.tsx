import Cascade from '../cascade/Cascade';

import { Component } from './Component';
import Portal from './Portal';

describe('Component.portal', () => {
    it('should render Components to specified Element', async () => {
        var container = document.createElement('div');
        var portalContainer = document.createElement('div');

        class Parent extends Component<any> {
            render() {
                return (
                    <div>
                        <Child />
                    </div>
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
        var root = <Parent />;

        var container = document.createElement('div');
        Cascade.render(container, root);

        expect(container.childNodes[0].textContent).toBe('');
        expect(portalContainer.childNodes[0].textContent).toBe('Child');
    });
});
