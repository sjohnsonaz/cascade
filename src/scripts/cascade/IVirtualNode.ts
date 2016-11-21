export interface IVirtualNodeProps {
    key?: string;
    ref?: (node: Node) => void;
}

export interface IVirtualNode<T extends IVirtualNodeProps> {
    props: T;
    children: Array<IVirtualNode<any> | string | number>;
    key: string;

    toNode(): Node;
    toString(): string;
}
