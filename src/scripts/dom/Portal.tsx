import Cascade from '../modules/Cascade';
import { Component } from "./Component";

export interface IPortalProps {
    element: HTMLElement;
    front?: boolean;
}

export default class Portal extends Component<IPortalProps> {
    portal = true;

    render() {
        return (
            <div>{this.children}</div>
        );
    }

    beforeRender(mounted: boolean) {
        if (mounted && this.element && this.props.front) {
            this.props.element.appendChild(this.element);
        }
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