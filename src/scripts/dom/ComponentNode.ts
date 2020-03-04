import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';
import { Component } from './Component';
import Fragment from './Fragment';

export default class ComponentNode<T> implements IVirtualNode<T> {
    componentConstructor: new (props?: T, children?: any[]) => Component<T>;
    props: T & IVirtualNodeProps;
    children: any;
    key: string | number;
    component: Component<T>;

    constructor(
        componentConstructor: new (props?: T & IVirtualNodeProps, children?: any[]) => Component<T>,
        props?: T,
        children?: Array<any>
    ) {
        this.componentConstructor = componentConstructor;
        this.props = props || ({} as any);
        this.key = this.props.key;
        this.children = children;

        // Push this to the current context
        let context = Component.getContext()
        if (context) {
            context.push(this);
        }
    }

    toComponent(): Component<T> {
        this.component = new this.componentConstructor(this.props, this.children);
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