import Cascade from '../modules/Cascade';
import { Component } from "./Component";

export interface IPortalProps {
    element: HTMLElement;
}

export default class Portal extends Component<IPortalProps> {
    portal = true;

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }

    afterRender(node: Node, updated: boolean) {
        if (!this.props.element.contains(node)) {
            this.props.element.appendChild(node);
        }
    }

    afterDispose(node: Node) {
        this.props.element.removeChild(node);
    }
}