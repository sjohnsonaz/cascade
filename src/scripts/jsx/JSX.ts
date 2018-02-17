import { IVirtualNode, IVirtualNodeProps } from '../dom/IVirtualNode';
import { Component } from '../dom/Component';
import { Elements } from './Elements';

declare global {
    namespace JSX {
        export interface Element extends IVirtualNode<IVirtualNodeProps> { }

        export interface ElementClass extends Component<{}> {
            render(): any;
        }

        export interface ElementAttributesProperty {
            props: IVirtualNodeProps;
        }

        export interface IntrinsicAttributes extends IVirtualNodeProps { }

        export interface IntrinsicClassAttributes<T> extends IVirtualNodeProps { }

        export interface IntrinsicElements {
            a: Elements.JSXAnchorElement;
            abbr: Elements.JSXElement;
            address: Elements.JSXElement;
            area: Elements.JSXElement;
            article: Elements.JSXElement;
            aside: Elements.JSXElement;
            audio: Elements.JSXAudioElement;
            b: Elements.JSXElement;
            base: Elements.JSXBaseElement;
            bdi: Elements.JSXElement;
            bdo: Elements.JSXElement;
            big: Elements.JSXElement;
            blockquote: Elements.JSXQuoteElement;
            body: Elements.JSXBodyElement;
            br: Elements.JSXBRElement;
            button: Elements.JSXButtonElement;
            canvas: Elements.JSXCanvasElement;
            caption: Elements.JSXTableCaptionElement;
            cite: Elements.JSXElement;
            code: Elements.JSXElement;
            col: Elements.JSXTableColElement;
            colgroup: Elements.JSXTableColElement;
            data: Elements.JSXDataElement;
            datalist: Elements.JSXDataListElement;
            dd: Elements.JSXElement;
            del: Elements.JSXModElement;
            details: Elements.JSXDetailsElement;
            dfn: Elements.JSXElement;
            dialog: Elements.JSXElement;
            div: Elements.JSXDivElement;
            dl: Elements.JSXDListElement;
            dt: Elements.JSXElement;
            em: Elements.JSXElement;
            embed: Elements.JSXEmbedElement;
            fieldset: Elements.JSXFieldSetElement;
            figcaption: Elements.JSXElement;
            figure: Elements.JSXElement;
            footer: Elements.JSXElement;
            form: Elements.JSXFormElement;
            h1: Elements.JSXHeadingElement;
            h2: Elements.JSXHeadingElement;
            h3: Elements.JSXHeadingElement;
            h4: Elements.JSXHeadingElement;
            h5: Elements.JSXHeadingElement;
            h6: Elements.JSXHeadingElement;
            head: Elements.JSXHeadElement;
            header: Elements.JSXElement;
            hr: Elements.JSXHRElement;
            html: Elements.JSXHtmlElement;
            i: Elements.JSXElement;
            iframe: Elements.JSXIFrameElement;
            img: Elements.JSXImageElement;
            input: Elements.JSXInputElement;
            ins: Elements.JSXModElement;
            kbd: Elements.JSXElement;
            keygen: Elements.JSXKeygenElement;
            label: Elements.JSXLabelElement;
            legend: Elements.JSXLegendElement;
            li: Elements.JSXLIElement;
            link: Elements.JSXLinkElement;
            main: Elements.JSXElement;
            map: Elements.JSXMapElement;
            mark: Elements.JSXElement;
            menu: Elements.JSXMenuElement;
            menuitem: Elements.JSXElement;
            meta: Elements.JSXMetaElement;
            meter: Elements.JSXMeterElement;
            nav: Elements.JSXElement;
            noscript: Elements.JSXElement;
            object: Elements.JSXObjectElement;
            ol: Elements.JSXOListElement;
            optgroup: Elements.JSXOptGroupElement;
            option: Elements.JSXOptionElement;
            output: Elements.JSXOutputElement;
            p: Elements.JSXParagraphElement;
            param: Elements.JSXParamElement;
            picture: Elements.JSXElement;
            pre: Elements.JSXPreElement;
            progress: Elements.JSXProgressElement;
            q: Elements.JSXQuoteElement;
            rp: Elements.JSXElement;
            rt: Elements.JSXElement;
            ruby: Elements.JSXElement;
            s: Elements.JSXElement;
            samp: Elements.JSXElement;
            script: Elements.JSXScriptElement;
            section: Elements.JSXElement;
            select: Elements.JSXSelectElement;
            small: Elements.JSXElement;
            source: Elements.JSXSourceElement;
            span: Elements.JSXSpanElement;
            strong: Elements.JSXElement;
            style: Elements.JSXStyleElement;
            sub: Elements.JSXElement;
            summary: Elements.JSXElement;
            sup: Elements.JSXElement;
            table: Elements.JSXTableElement;
            tbody: Elements.JSXTableSectionElement;
            td: Elements.JSXTableDataCellElement;
            textarea: Elements.JSXTextAreaElement;
            tfoot: Elements.JSXTableSectionElement;
            th: Elements.JSXTableHeaderCellElement;
            thead: Elements.JSXTableSectionElement;
            time: Elements.JSXTimeElement;
            title: Elements.JSXTitleElement;
            tr: Elements.JSXTableRowElement;
            track: Elements.JSXTrackElement;
            u: Elements.JSXElement;
            ul: Elements.JSXUListElement;
            "var": Elements.JSXElement;
            video: Elements.JSXVideoElement;
            wbr: Elements.JSXElement;

            // SVG
            svg: Elements.JSXSVGElement;

            circle: Elements.JSXSVGElement;
            defs: Elements.JSXSVGElement;
            ellipse: Elements.JSXSVGElement;
            g: Elements.JSXSVGElement;
            line: Elements.JSXSVGElement;
            linearGradient: Elements.JSXSVGElement;
            mask: Elements.JSXSVGElement;
            path: Elements.JSXSVGElement;
            pattern: Elements.JSXSVGElement;
            polygon: Elements.JSXSVGElement;
            polyline: Elements.JSXSVGElement;
            radialGradient: Elements.JSXSVGElement;
            rect: Elements.JSXSVGElement;
            stop: Elements.JSXSVGElement;
            text: Elements.JSXSVGElement;
            tspan: Elements.JSXSVGElement;

            [elemName: string]: Elements.JSXElement;
        }
    }
}
