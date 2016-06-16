import VirtualNode from './VirtualNode';

export default class VirtualDom {
    constructor() {

    }

    static updateDom(html: Node, oldDom: VirtualNode, newDom: VirtualNode) {

    }

    static createElement(type: string, properties?: Object, ...children: Array<VirtualNode | string>) {
        return new VirtualNode(type, properties, ...children);
    }
}

export function Dom(type: string, properties: Object, ...children: Array<VirtualNode | string>) {
    return new VirtualNode(type, properties, ...children);
}
