import VirtualNode from './VirtualNode';
import { IVirtualNode, IVirtualNodeProps } from './IVirtualNode';

export default class Fragment implements IVirtualNode<IVirtualNodeProps> {
    type: string;
    children: any;
    props: IVirtualNodeProps;
    key: string;
    element: Node;

    constructor(props?: IVirtualNodeProps, ...children: Array<any>) {
        this.props = props || ({} as any);
        this.key = this.props.key;
        // TODO: Remove key and ref?
        // if (this.props.key) {
        // delete this.props.key;
        // }
        this.children = children ? VirtualNode.fixChildrenArrays(children) : [];
    }

    toNode() {
        var node = document.createDocumentFragment();
        for (var index = 0, length = this.children.length; index < length; index++) {
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
            this.props.ref(node);
        }
        this.element = node;
        return node;
    }

    toString() {
        var container = document.createElement('div') as HTMLElement;
        container.appendChild(this.toNode());
        return container.innerHTML;
    }
}