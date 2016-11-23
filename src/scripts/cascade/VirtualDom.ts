import {IVirtualNode} from './IVirtualNode';
import VirtualNode from './VirtualNode';
import Component from './Component';
import Graph from '../graph/Graph';

export default class VirtualDom {
    static createElement<T extends Object>(type: string | (new (props: T, ...children: Array<IVirtualNode<any> | string>) => Component<T>), props: T, ...children: Array<IVirtualNode<any> | string>): IVirtualNode<T> {
        if (typeof type === 'string') {
            return new VirtualNode(type, props, ...children);
        } else {
            return new type(props, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>, callback?: (n: Node) => void, reRender?: (n: IVirtualNode<any> | string | number) => void) {
        var fixedNode = typeof node === 'string' ?
            document.getElementById(node) :
            node;
        var renderedComponent = virtualNode.toNode();
        while (fixedNode.firstChild) {
            fixedNode.removeChild(fixedNode.firstChild);
        }
        fixedNode.appendChild(renderedComponent);
        if (callback) {
            callback(renderedComponent);
        }
        Graph.subscribe(virtualNode, 'root', function(root: IVirtualNode<any> | string | number) {
            if (reRender) {
                reRender(root);
            }
        });
    }
}