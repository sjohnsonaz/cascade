import VirtualNode from './VirtualNode';

export default class Component<T extends Object> extends VirtualNode<T> {
    constructor(type: string, properties?: T, ...children: Array<VirtualNode<any> | string>) {
        super(type, properties, ...children);
    }
}
