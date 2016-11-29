import {IVirtualNode, IVirtualNodeProps} from '../cascade/IVirtualNode';
import VirtualNode from '../cascade/VirtualNode';
import Component from '../cascade/Component';
import {ElementTypes} from './ElementTypes';

declare global {
    namespace JSX {
        export interface Element extends IVirtualNode<IVirtualNodeProps> { }

        export interface ElementClass extends Component<IVirtualNodeProps> {
            render(): IVirtualNode<any> | string | number;
        }

        export interface ElementAttributesProperty {
            props: IVirtualNodeProps;
        }

        export interface IntrinsicAttributes extends IVirtualNodeProps { }

        export interface IntrinsicClassAttributes<T> extends IVirtualNodeProps { }

        export interface IntrinsicElements {
            a: ElementTypes.CascadeAnchorElement;
            abbr: ElementTypes.CascadeHTMLElement;
            address: ElementTypes.CascadeHTMLElement;
            area: ElementTypes.CascadeHTMLElement;
            article: ElementTypes.CascadeHTMLElement;
            aside: ElementTypes.CascadeHTMLElement;
            audio: ElementTypes.CascadeAudioElement;
            b: ElementTypes.CascadeHTMLElement;
            base: ElementTypes.CascadeBaseElement;
            bdi: ElementTypes.CascadeHTMLElement;
            bdo: ElementTypes.CascadeHTMLElement;
            big: ElementTypes.CascadeHTMLElement;
            blockquote: ElementTypes.CascadeQuoteElement;
            body: ElementTypes.CascadeBodyElement;
            br: ElementTypes.CascadeBRElement;
            button: ElementTypes.CascadeButtonElement;
            canvas: ElementTypes.CascadeCanvasElement;
            caption: ElementTypes.CascadeTableCaptionElement;
            cite: ElementTypes.CascadeHTMLElement;
            code: ElementTypes.CascadeHTMLElement;
            col: ElementTypes.CascadeTableColElement;
            colgroup: ElementTypes.CascadeTableColElement;
            data: ElementTypes.CascadeDataElement;
            datalist: ElementTypes.CascadeDataListElement;
            dd: ElementTypes.CascadeHTMLElement;
            del: ElementTypes.CascadeModElement;
            details: ElementTypes.CascadeDetailsElement;
            dfn: ElementTypes.CascadeHTMLElement;
            dialog: ElementTypes.CascadeHTMLElement;
            div: ElementTypes.CascadeDivElement;
            dl: ElementTypes.CascadeDListElement;
            dt: ElementTypes.CascadeHTMLElement;
            em: ElementTypes.CascadeHTMLElement;
            embed: ElementTypes.CascadeEmbedElement;
            fieldset: ElementTypes.CascadeFieldSetElement;
            figcaption: ElementTypes.CascadeHTMLElement;
            figure: ElementTypes.CascadeHTMLElement;
            footer: ElementTypes.CascadeHTMLElement;
            form: ElementTypes.CascadeFormElement;
            h1: ElementTypes.CascadeHeadingElement;
            h2: ElementTypes.CascadeHeadingElement;
            h3: ElementTypes.CascadeHeadingElement;
            h4: ElementTypes.CascadeHeadingElement;
            h5: ElementTypes.CascadeHeadingElement;
            h6: ElementTypes.CascadeHeadingElement;
            head: ElementTypes.CascadeHeadElement;
            header: ElementTypes.CascadeHTMLElement;
            hr: ElementTypes.CascadeHRElement;
            html: ElementTypes.CascadeHTMLHtmlElement;
            i: ElementTypes.CascadeHTMLElement;
            iframe: ElementTypes.CascadeIFrameElement;
            img: ElementTypes.CascadeImageElement;
            input: ElementTypes.CascadeInputElement;
            ins: ElementTypes.CascadeModElement;
            kbd: ElementTypes.CascadeHTMLElement;
            keygen: ElementTypes.CascadeKeygenElement;
            label: ElementTypes.CascadeLabelElement;
            legend: ElementTypes.CascadeLegendElement;
            li: ElementTypes.CascadeLIElement;
            link: ElementTypes.CascadeLinkElement;
            main: ElementTypes.CascadeHTMLElement;
            map: ElementTypes.CascadeMapElement;
            mark: ElementTypes.CascadeHTMLElement;
            menu: ElementTypes.CascadeMenuElement;
            menuitem: ElementTypes.CascadeElement;
            meta: ElementTypes.CascadeMetaElement;
            meter: ElementTypes.CascadeMeterElement;
            nav: ElementTypes.CascadeHTMLElement;
            noscript: ElementTypes.CascadeHTMLElement;
            object: ElementTypes.CascadeObjectElement;
            ol: ElementTypes.CascadeOListElement;
            optgroup: ElementTypes.CascadeOptGroupElement;
            option: ElementTypes.CascadeOptionElement;
            output: ElementTypes.CascadeOutputElement;
            p: ElementTypes.CascadeParagraphElement;
            param: ElementTypes.CascadeParamElement;
            picture: ElementTypes.CascadeHTMLElement;
            pre: ElementTypes.CascadePreElement;
            progress: ElementTypes.CascadeProgressElement;
            q: ElementTypes.CascadeQuoteElement;
            rp: ElementTypes.CascadeHTMLElement;
            rt: ElementTypes.CascadeHTMLElement;
            ruby: ElementTypes.CascadeHTMLElement;
            s: ElementTypes.CascadeHTMLElement;
            samp: ElementTypes.CascadeHTMLElement;
            script: ElementTypes.CascadeScriptElement;
            section: ElementTypes.CascadeHTMLElement;
            select: ElementTypes.CascadeSelectElement;
            small: ElementTypes.CascadeHTMLElement;
            source: ElementTypes.CascadeSourceElement;
            span: ElementTypes.CascadeSpanElement;
            strong: ElementTypes.CascadeHTMLElement;
            style: ElementTypes.CascadeStyleElement;
            sub: ElementTypes.CascadeHTMLElement;
            summary: ElementTypes.CascadeHTMLElement;
            sup: ElementTypes.CascadeHTMLElement;
            table: ElementTypes.CascadeTableElement;
            tbody: ElementTypes.CascadeTableSectionElement;
            td: ElementTypes.CascadeTableDataCellElement;
            textarea: ElementTypes.CascadeTextAreaElement;
            tfoot: ElementTypes.CascadeTableSectionElement;
            th: ElementTypes.CascadeTableHeaderCellElement;
            thead: ElementTypes.CascadeTableSectionElement;
            time: ElementTypes.CascadeTimeElement;
            title: ElementTypes.CascadeTitleElement;
            tr: ElementTypes.CascadeTableRowElement;
            track: ElementTypes.CascadeTrackElement;
            u: ElementTypes.CascadeHTMLElement;
            ul: ElementTypes.CascadeUListElement;
            "var": ElementTypes.CascadeHTMLElement;
            video: ElementTypes.CascadeVideoElement;
            wbr: ElementTypes.CascadeHTMLElement;

            // SVG
            svg: ElementTypes.CascadeSVGElement;

            circle: ElementTypes.CascadeSVGElement;
            defs: ElementTypes.CascadeSVGElement;
            ellipse: ElementTypes.CascadeSVGElement;
            g: ElementTypes.CascadeSVGElement;
            line: ElementTypes.CascadeSVGElement;
            linearGradient: ElementTypes.CascadeSVGElement;
            mask: ElementTypes.CascadeSVGElement;
            path: ElementTypes.CascadeSVGElement;
            pattern: ElementTypes.CascadeSVGElement;
            polygon: ElementTypes.CascadeSVGElement;
            polyline: ElementTypes.CascadeSVGElement;
            radialGradient: ElementTypes.CascadeSVGElement;
            rect: ElementTypes.CascadeSVGElement;
            stop: ElementTypes.CascadeSVGElement;
            text: ElementTypes.CascadeSVGElement;
            tspan: ElementTypes.CascadeSVGElement;

            [elemName: string]: ElementTypes.CascadeHTMLElement;
        }
    }
}
