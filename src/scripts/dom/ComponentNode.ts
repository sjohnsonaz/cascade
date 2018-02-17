import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import { Component } from './Component';
import VirtualNode from './VirtualNode';

export default class ComponentNode<T> implements IVirtualNode<T> {
    componentConstructor: new (props?: T, ...children: any[]) => Component<T>;
    props: T & IVirtualNodeProps;
    children: any;
    key: string;
    element: Node;
    component: Component<T>;

    constructor(
        componentConstructor: new (props?: T & IVirtualNodeProps, ...children: any[]) => Component<T>,
        props?: T,
        ...children: Array<any>
    ) {
        this.componentConstructor = componentConstructor;
        this.props = props || ({} as any);
        this.key = this.props.key;
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    toComponent(): Component<T> {
        this.component = new this.componentConstructor(this.props, ...this.children);
        this.component.init();
        return this.component;
    }

    toNode(): Node {
        if (!this.component) {
            this.toComponent();
        }
        return this.component.toNode();
    }
}