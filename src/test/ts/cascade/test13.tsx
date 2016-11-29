import TestRunner from '../TestRunner';
import Cascade, {Component, VirtualNode} from '../../../scripts/modules/Cascade';
import Diff, {DiffOperation} from '../../../scripts/cascade/Diff';

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

TestRunner.test({
    name: 'Diff algorithm compares VirtualNodes',
    test: function(input, callback: any) {
        var oldComponent: Component<any> = <OldComponent /> as any;
        var newComponent: Component<any> = <NewComponent /> as any;
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
        callback({
            nodesToAdd: nodesToAdd,
            nodesToRemove: nodesToRemove,
            nodesToLeave: nodesToLeave
        });
    },
    assert: function(result, callback) {
        callback(
            result.nodesToAdd.length === 1 && result.nodesToAdd[0].type === 'div' &&
            result.nodesToRemove.length === 1 && result.nodesToRemove[0].type === 'span' &&
            result.nodesToLeave.length === 0
        );
    }
});
