import VirtualNode from './VirtualNode';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';

export default class Fragment implements IVirtualNode<IVirtualNodeProps> {
    type: string;
    children: any[];
    props: IVirtualNodeProps;
    key: string | number;
    element: Node;
    elementArray: Node[];

    constructor(props?: IVirtualNodeProps, children?: Array<any>) {
        this.storeProps(props, children);
    }

    storeProps(props?: IVirtualNodeProps, children?: any[]) {
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children;
    }

    update(props?: IVirtualNodeProps, children?: Array<any>) {
        this.storeProps(props, children);
    }

    toNode() {
        var node = document.createDocumentFragment();
        for (let index = 0, length = this.children.length; index < length; index++) {
            var child = this.children[index];
            switch (typeof child) {
                case 'string':
                    node.appendChild(document.createTextNode(child as string));
                    break;
                case 'object':
                    if (child) {
                        if ((child as IVirtualNode<any>).toNode) {
                            var renderedNode = (child as IVirtualNode<any>).toNode();
                            if (renderedNode instanceof Node) {
                                node.appendChild(renderedNode);
                            }
                        } else {
                            node.appendChild(document.createTextNode(child.toString()));
                        }
                    }
                    break;
                case 'undefined':
                    break;
                // case 'number':
                default:
                    node.appendChild(document.createTextNode(child.toString()));
                    break;
            }
        }
        if (this.props && this.props.ref) {
            if (typeof this.props.ref === 'function') {
                this.props.ref(node);
            } else {
                this.props.ref.current = node;
            }
        }
        let elementArray: Node[] = [];
        let childNodes = node.childNodes;
        for (let index = 0, length = childNodes.length; index < length; index++) {
            elementArray.push(childNodes[index]);
        }
        this.elementArray = elementArray;
        this.element = node;
        return node;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.toNode());
        return container.innerHTML;
    }

    dispose() {

    }

    getChildLength() {
        let childLength = 0;
        for (let child of this.children) {
            if (child !== null && child !== undefined) {
                if (child.getChildLength) {
                    childLength += child.getChildLength();
                } else if (child.children) {
                    childLength += child.children.length;
                } else {
                    childLength++;
                }
            }
        }
        return childLength;
    }
}