export interface IVirtualNodeProps {
    key?: string;
    ref?: (node: Node) => void;
}

export interface IVirtualElementProps extends IVirtualNodeProps {
    xmlns?: string;
}

export interface IVirtualNode<T> {
    props: T & IVirtualNodeProps;
    children: any;
    key: string;

    toNode(): Node;
    toString(): string;
}
