import Cascade from '../cascade/Cascade';
import { ComponentNode, VirtualNode } from '../modules/Cascade';

import Diff, { DiffOperation } from '../util/Diff';

import { Component } from './Component';

interface IComponentProps {}

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

describe('Component', function () {
    it('should be comparable with Diff', function () {
        let oldComponentNode = (<OldComponent />) as ComponentNode<any>;
        let newComponentNode = (<NewComponent />) as ComponentNode<any>;
        var diff = Diff.compare<VirtualNode<any>>(
            oldComponentNode.toComponent().root.children,
            newComponentNode.toComponent().root.children,
            (newNode: VirtualNode<any>, oldNode: VirtualNode<any>) => {
                var output = false;
                if (newNode && oldNode) {
                    if (newNode.type == oldNode.type) {
                        // TODO: Add key comparison
                        output = true;
                    }
                }
                return output;
            },
        );
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
        expect(nodesToAdd.length).toBe(1);
        expect(nodesToRemove.length).toBe(1);
        expect(nodesToLeave.length).toBe(0);
        expect(nodesToAdd[0].type).toBe('div');
        expect(nodesToRemove[0].type).toBe('span');
    });
});
