import Ref from './Ref';

export interface IVirtualNodeProps {
    key?: string | number;
    ref?: Ref | ((node: Node) => void);
}

export interface IVirtualElementProps extends IVirtualNodeProps {
    xmlns?: string;
}

export interface IVirtualNode<T> {
    props: T & IVirtualNodeProps;
    children: any[];
    key: string | number;

    toNode(namespace?: string): Node;
    toString(): string;
}
