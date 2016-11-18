export interface IVirtualNodeProperties {
    key?: string;
    ref?: (node: Node) => void;
}

export interface IVirtualNode<T extends IVirtualNodeProperties> {
    properties: T;
    children: Array<IVirtualNode<any> | string | number>;
    key: string;

    toNode(oldValue?: Node): Node;
    toString(): string;
}
