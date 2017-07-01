export interface IVirtualNodeProps {
    key?: string;
    ref?: (node: Node) => void;
    [index: string]: any;
}

export interface IVirtualNode<T extends IVirtualNodeProps> {
    props: T;
    children: any;
    key: string;

    toNode(): Node;
    toString(): string;
}
