export interface IVirtualNodeProps {
    key?: string;
    ref?: (node: Node) => void;
}

export interface IVirtualNode<T extends IVirtualNodeProps> {
    props: T;
    children: Array<IVirtualNode<any> | string | number>;
    key: string;

    toNode(oldValue?: Node): Node;
    toString(): string;
}
