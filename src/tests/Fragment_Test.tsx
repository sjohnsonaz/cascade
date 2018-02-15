import { expect } from 'chai';

import Cascade, { VirtualNode, Component } from '../scripts/modules/Cascade';

describe('Fragment.toNode', function () {
    it('should render Fragment Nodes', () => {
        var root = (
            <>
                <div id="testId"></div>
            </>
        );
        let rootElement = document.createElement('div');
        Cascade.render(rootElement, root, function (element: HTMLElement) {
            let div: HTMLElement = rootElement.childNodes[0] as any;
            expect(div.id).to.equal('testId');
        });
    });
});