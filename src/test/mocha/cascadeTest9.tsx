import {expect} from 'chai';

import Cascade, {Component, VirtualNode} from '../../scripts/modules/Cascade';
import Diff, {DiffOperation} from '../../scripts/cascade/Diff';

interface IComponentProps {

}

class OldComponent extends Component<IComponentProps> {
    render() {
        return (
            <div>
                <span>Text</span>
            </div>
        );
    }
}

class NewComponent extends Component<IComponentProps> {
    render() {
        return (
            <div>
                <div>Text</div>
            </div>
        );
    }
}

describe('Component', function() {
    it('should be comparable with Diff', function() {
        var oldComponent: Component<any> = <OldComponent />;
        var newComponent: Component<any> = <NewComponent />;
        var diff = Diff.compare<VirtualNode<any>>(
            (oldComponent.root as any).children,
            (newComponent.root as any).children,
            (newNode: VirtualNode<any>, oldNode: VirtualNode<any>) => {
                var output = false;
                if (newNode && oldNode) {
                    if (newNode.type == oldNode.type) {
                        // TODO: Add key comparison
                        output = true;
                    }
                }
                return output;
            });
        var nodesToAdd = [];
        var nodesToRemove = [];
        var nodesToLeave = [];
        for (var index = 0, length = diff.length; index < length; index++) {
            var diffItem = diff[index];
            switch (diffItem.operation) {
                case DiffOperation.REMOVE:
                nodesToRemove.push(diffItem.item);
                break;
                case DiffOperation.NONE:
                nodesToLeave.push(diffItem.item);
                break;
                case DiffOperation.ADD:
                nodesToAdd.push(diffItem.item);
                break;
            }
        }
        expect(nodesToAdd.length).to.equal(1);
        expect(nodesToRemove.length).to.equal(1);
        expect(nodesToLeave.length).to.equal(0);
        expect(nodesToAdd[0].type).to.equal('div');
        expect(nodesToRemove[0].type).to.equal('span');
    });
});
