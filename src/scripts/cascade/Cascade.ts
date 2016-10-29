import {IVirtualNode} from './IVirtualNode';
import VirtualNode from './VirtualNode';
import Component from './Component';
import Graph from '../graph/Graph';

export default class Cascade {
    static createElement<T extends IVirtualNode<U>, U>(type: string | (new (...args: any[]) => T), properties: U, ...children: Array<IVirtualNode<any> | string>) {
        if (typeof type === 'string') {
            return new VirtualNode(type, properties, ...children);
        } else {
            return new type(properties, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: IVirtualNode<any>, callback: (n: Node) => any) {
        var fixedNode: HTMLElement;
        if (typeof node === 'string') {
            fixedNode = document.getElementById(node);
        } else {
            fixedNode = node;
        }
        if (virtualNode instanceof Component) {
            Cascade.subscribe(virtualNode, 'element', function(value: Node) {
                if (value) {
                    while (fixedNode.firstChild) {
                        fixedNode.removeChild(fixedNode.firstChild);
                    }
                    fixedNode.appendChild(value);
                    callback(value);
                }
            });
            var element = virtualNode.element;
        } else {
            callback(virtualNode.toNode());
        }
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
