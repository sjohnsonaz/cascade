import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import { Component } from './Component';
import VirtualNode from './VirtualNode';

export default class ComponentNode<T extends IVirtualNodeProps> implements IVirtualNode<T> {
    componentConstructor: new (props?: T, ...children: any[]) => Component<T>;
    props: T;
    children: any;
    key: string;
    element: Node;

    constructor(
        componentConstructor: new (props?: T, ...children: any[]) => Component<T>,
        props?: T,
        ...children: Array<any>
    ) {
        this.componentConstructor = componentConstructor;
        this.props = props || ({} as any);
        this.key = this.props.key;
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    toNode(): Node {
        var component = new this.componentConstructor(this.props, ...this.children);
        component.init();
        return component.toNode();
    }
}