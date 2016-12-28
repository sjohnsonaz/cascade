import { IVirtualNode } from './IVirtualNode';
import VirtualNode from './VirtualNode';
import { Component } from './Component';
import Graph from '../graph/Graph';

export default class VirtualDom {
    static createElement<T extends Object>(type: string | (new (props: T, ...children: Array<any>) => Component<T>), props: T, ...children: Array<any>): IVirtualNode<T> {
        if (typeof type === 'string') {
            return new VirtualNode(type, props, ...children);
        } else {
            var component = new type(props, ...children);
            component.init();
            return component;
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>, callback?: (n: Node) => void, reRender?: (n: any) => void) {
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
        Graph.subscribe(virtualNode, 'root', function (root: any) {
            if (reRender) {
                reRender(root);
            }
        });
    }
}
