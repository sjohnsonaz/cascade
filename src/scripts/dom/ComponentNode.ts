import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import { Component } from './Component';
import VirtualNode from './VirtualNode';
import Fragment from './Fragment';

export default class ComponentNode<T> implements IVirtualNode<T> {
    componentConstructor: new (props?: T) => Component<T>;
    props: T & IVirtualNodeProps;
    key: string | number;
    component: Component<T>;

    constructor(
        componentConstructor: new (props?: T & IVirtualNodeProps) => Component<T>,
        props?: T
    ) {
        this.componentConstructor = componentConstructor;
        this.props = props || ({} as any);
        this.key = this.props.key;
        this.props.children = this.props.children ? VirtualNode.fixChildrenArrays(this.props.children) : [];

        // Push this to the current context
        let context = Component.getContext()
        if (context) {
            context.push(this);
        }
    }

    toComponent(): Component<T> {
        this.component = new this.componentConstructor(this.props);
        if (!(this.component instanceof Fragment)) {
            this.component.init();
        }
        return this.component;
    }

    toNode(namespace: string): Node {
        if (!this.component) {
            this.toComponent();
        }
        return this.component.toNode(namespace);
    }

    dispose() {
        if (this.component) {
            this.component.dispose();
        }
    }
}