import Cascade from '../modules/Cascade';
import { Component } from "./Component";

export interface IPortalProps {
    element: HTMLElement;
    remove?: boolean;
}

export default class Portal extends Component<IPortalProps> {
    portal = true;

    render() {
        return (
            <div>{this.children}</div>
        );
    }

    afterRender(node: Node, updated: boolean) {
        if (!this.props.element.contains(node)) {
            if (!this.props.remove) {
                this.props.element.appendChild(node);
            }
        } else {
            if (this.props.remove) {
                this.props.element.removeChild(node);
            }
        }
    }

    afterDispose(node: Node) {
        if (this.props.element.contains(node)) {
            this.props.element.removeChild(node);
        }
    }
}