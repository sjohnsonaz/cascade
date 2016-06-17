import VirtualNode from './VirtualNode';

export default class Cascade {
    static createElement<T extends VirtualNode<U>, U>(type: string | (new (...args: any[]) => T), properties: U, ...children: Array<VirtualNode<any> | string>) {
        if (typeof type === 'string') {
            return new VirtualNode(type, properties, ...children);
        } else {
            return new type(undefined, properties, ...children);
        }
    }
}
