import VirtualNode from './VirtualNode';

export default class Cascade {
    static createElement(type: string, properties: Object, ...children: Array<VirtualNode | string>) {
        return new VirtualNode(type, properties, ...children);
    }
}
