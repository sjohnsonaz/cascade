import Cascade from './Cascade';

export interface IVirtualNode<T extends Object> {
    properties: T;
    children: Array<IVirtualNode<any> | string>;

    toNode(oldValue?: Node): Node;
    toString(): string;
}
