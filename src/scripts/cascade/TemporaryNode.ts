export default class TemporaryNode<T extends Object> {
    type: string;
    properties: T;
    children: Array<TemporaryNode<any> | string>;
    constructor(type: string, properties?: T, ...children: Array<TemporaryNode<any> | string>) {
    }
}
