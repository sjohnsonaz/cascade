export interface IVirtualNodeProps {
    key?: string | number;
    ref?: (node: Node) => void;
}

export interface IVirtualElementProps extends IVirtualNodeProps {
    xmlns?: string;
}

export interface IVirtualNode<T> {
    props: T & IVirtualNodeProps;
    children: any;
    key: string;

    toNode(namespace?: string): Node;
    toString(): string;
}
