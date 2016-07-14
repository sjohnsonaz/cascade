import VirtualNode from './VirtualNode';
import Graph from '../graph/Graph';

export default class Cascade {
    static createElement<T extends VirtualNode<U>, U>(type: string | (new (...args: any[]) => T), properties: U, ...children: Array<VirtualNode<any> | string>) {
        if (typeof type === 'string') {
            return new VirtualNode(type, properties, ...children);
        } else {
            return new type(undefined, properties, ...children);
        }
    }

    static render(node: HTMLElement | string, virtualNode: VirtualNode<any>, callback: (n: Node) => any) {
        var fixedNode: HTMLElement;
        if (typeof node === 'string') {
            fixedNode = document.getElementById(node);
        } else {
            fixedNode = node;
        }
        (virtualNode as any)._graph.observables.element.subscribe(function(value) {
            if (value) {
                while (fixedNode.firstChild) {
                    fixedNode.removeChild(fixedNode.firstChild);
                }
                fixedNode.appendChild(value);
                callback(value);
            }
        });
        var element = virtualNode.element;
    }

    static createObservable = Graph.createObservable;
    static createComputed = Graph.createComputed;
    static disposeAll = Graph.disposeAll;
}
