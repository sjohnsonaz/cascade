import {IVirtualNode} from './IVirtualNode';
import VirtualNode from './VirtualNode';
import Component from './Component';
import Graph from '../graph/Graph';

export default class Cascade {
    static createElement<T extends Object>(type: string | (new (properties: T, ...children: Array<IVirtualNode<any> | string>) => Component<T>), properties: T, ...children: Array<IVirtualNode<any> | string>): IVirtualNode<T> {
        if (typeof type === 'string') {
            return new VirtualNode(type, properties, ...children);
        } else {
            return new type(properties, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>, callback?: (n: Node) => void, reRender?: (n: IVirtualNode<any> | string | number) => void) {
        var fixedNode = typeof node === 'string' ?
            document.getElementById(node) :
            node;
        var renderedComponent = virtualNode instanceof Component ?
            virtualNode.renderToNode() :
            virtualNode.toNode();
        while (fixedNode.firstChild) {
            fixedNode.removeChild(fixedNode.firstChild);
        }
        fixedNode.appendChild(renderedComponent);
        if (callback) {
            callback(renderedComponent);
        }
        Cascade.subscribe(virtualNode, 'root', function(root: IVirtualNode<any> | string | number) {
            if (reRender) {
                reRender(root);
            }
        });
    }

    static createObservable = Graph.createObservable;
    static createComputed = Graph.createComputed;
    static disposeAll = Graph.disposeAll;
    static peek = Graph.peek;
    static subscribe = Graph.subscribe;
    static getObservable = Graph.getObservable;
    static getSubscribers = Graph.getSubscribers;
    static getReferences = Graph.getReferences;
}
