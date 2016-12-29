import { IVirtualNodeProps } from '../cascade/IVirtualNode';

export namespace Elements {
    export interface BaseNode {
        nodeValue?: string;
        textContent?: string;
        [name: string]: any;
    }

    export interface BaseElement extends BaseNode, IVirtualNodeProps {
        className?: string;
        id?: string;
        msContentZoomFactor?: number;
        onariarequest?: (ev?: AriaRequestEvent) => any;
        oncommand?: (ev?: CommandEvent) => any;
        ongotpointercapture?: (ev?: PointerEvent) => any;
        onlostpointercapture?: (ev?: PointerEvent) => any;
        onmsgesturechange?: (ev?: MSGestureEvent) => any;
        onmsgesturedoubletap?: (ev?: MSGestureEvent) => any;
        onmsgestureend?: (ev?: MSGestureEvent) => any;
        onmsgesturehold?: (ev?: MSGestureEvent) => any;
        onmsgesturestart?: (ev?: MSGestureEvent) => any;
        onmsgesturetap?: (ev?: MSGestureEvent) => any;
        onmsgotpointercapture?: (ev?: MSPointerEvent) => any;
        onmsinertiastart?: (ev?: MSGestureEvent) => any;
        onmslostpointercapture?: (ev?: MSPointerEvent) => any;
        onmspointercancel?: (ev?: MSPointerEvent) => any;
        onmspointerdown?: (ev?: MSPointerEvent) => any;
        onmspointerenter?: (ev?: MSPointerEvent) => any;
        onmspointerleave?: (ev?: MSPointerEvent) => any;
        onmspointermove?: (ev?: MSPointerEvent) => any;
        onmspointerout?: (ev?: MSPointerEvent) => any;
        onmspointerover?: (ev?: MSPointerEvent) => any;
        onmspointerup?: (ev?: MSPointerEvent) => any;
        ontouchcancel?: (ev?: TouchEvent) => any;
        ontouchend?: (ev?: TouchEvent) => any;
        ontouchmove?: (ev?: TouchEvent) => any;
        ontouchstart?: (ev?: TouchEvent) => any;
        onwebkitfullscreenchange?: (ev?: Event) => any;
        onwebkitfullscreenerror?: (ev?: Event) => any;
        scrollLeft?: number;
        scrollTop?: number;
        innerHTML?: string;
    }

    export interface JSXElement extends BaseElement {
        accessKey?: string;
        contentEditable?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        hideFocus?: boolean;
        innerHTML?: string;
        innerText?: string;
        lang?: string;
        onabort?: (ev?: UIEvent) => any;
        onactivate?: (ev?: UIEvent) => any;
        onbeforeactivate?: (ev?: UIEvent) => any;
        onbeforecopy?: (ev?: ClipboardEvent) => any;
        onbeforecut?: (ev?: ClipboardEvent) => any;
        onbeforedeactivate?: (ev?: UIEvent) => any;
        onbeforepaste?: (ev?: ClipboardEvent) => any;
        onblur?: (ev?: FocusEvent) => any;
        oncanplay?: (ev?: Event) => any;
        oncanplaythrough?: (ev?: Event) => any;
        onchange?: (ev?: Event) => any;
        onclick?: (ev?: MouseEvent) => any;
        oncontextmenu?: (ev?: PointerEvent) => any;
        oncopy?: (ev?: ClipboardEvent) => any;
        oncuechange?: (ev?: Event) => any;
        oncut?: (ev?: ClipboardEvent) => any;
        ondblclick?: (ev?: MouseEvent) => any;
        ondeactivate?: (ev?: UIEvent) => any;
        ondrag?: (ev?: DragEvent) => any;
        ondragend?: (ev?: DragEvent) => any;
        ondragenter?: (ev?: DragEvent) => any;
        ondragleave?: (ev?: DragEvent) => any;
        ondragover?: (ev?: DragEvent) => any;
        ondragstart?: (ev?: DragEvent) => any;
        ondrop?: (ev?: DragEvent) => any;
        ondurationchange?: (ev?: Event) => any;
        onemptied?: (ev?: Event) => any;
        onended?: (ev?: MediaStreamErrorEvent) => any;
        onerror?: (ev?: ErrorEvent) => any;
        onfocus?: (ev?: FocusEvent) => any;
        oninput?: (ev?: Event) => any;
        oninvalid?: (ev?: Event) => any;
        onkeydown?: (ev?: KeyboardEvent) => any;
        onkeypress?: (ev?: KeyboardEvent) => any;
        onkeyup?: (ev?: KeyboardEvent) => any;
        onload?: (ev?: Event) => any;
        onloadeddata?: (ev?: Event) => any;
        onloadedmetadata?: (ev?: Event) => any;
        onloadstart?: (ev?: Event) => any;
        onmousedown?: (ev?: MouseEvent) => any;
        onmouseenter?: (ev?: MouseEvent) => any;
        onmouseleave?: (ev?: MouseEvent) => any;
        onmousemove?: (ev?: MouseEvent) => any;
        onmouseout?: (ev?: MouseEvent) => any;
        onmouseover?: (ev?: MouseEvent) => any;
        onmouseup?: (ev?: MouseEvent) => any;
        onmousewheel?: (ev?: WheelEvent) => any;
        onmscontentzoom?: (ev?: UIEvent) => any;
        onmsmanipulationstatechanged?: (ev?: MSManipulationEvent) => any;
        onpaste?: (ev?: ClipboardEvent) => any;
        onpause?: (ev?: Event) => any;
        onplay?: (ev?: Event) => any;
        onplaying?: (ev?: Event) => any;
        onprogress?: (ev?: ProgressEvent) => any;
        onratechange?: (ev?: Event) => any;
        onreset?: (ev?: Event) => any;
        onscroll?: (ev?: UIEvent) => any;
        onseeked?: (ev?: Event) => any;
        onseeking?: (ev?: Event) => any;
        onselect?: (ev?: UIEvent) => any;
        onselectstart?: (ev?: Event) => any;
        onstalled?: (ev?: Event) => any;
        onsubmit?: (ev?: Event) => any;
        onsuspend?: (ev?: Event) => any;
        ontimeupdate?: (ev?: Event) => any;
        onvolumechange?: (ev?: Event) => any;
        onwaiting?: (ev?: Event) => any;
        outerHTML?: string;
        outerText?: string;
        spellcheck?: boolean;
        style?: string;
        tabIndex?: number;
        title?: string;
    }

    export interface JSXSVGElement extends BaseElement {
        onclick?: (ev?: MouseEvent) => any;
        ondblclick?: (ev?: MouseEvent) => any;
        onfocusin?: (ev?: FocusEvent) => any;
        onfocusout?: (ev?: FocusEvent) => any;
        onload?: (ev?: Event) => any;
        onmousedown?: (ev?: MouseEvent) => any;
        onmousemove?: (ev?: MouseEvent) => any;
        onmouseout?: (ev?: MouseEvent) => any;
        onmouseover?: (ev?: MouseEvent) => any;
        onmouseup?: (ev?: MouseEvent) => any;
        xmlbase?: string;
        className?: any;
    }

    export interface JSXAnchorElement extends JSXElement {
        Methods?: string;
        charset?: string;
        coords?: string;
        hash?: string;
        host?: string;
        hostname?: string;
        href?: string;
        hreflang?: string;
        mimeType?: string;
        name?: string;
        nameProp?: string;
        pathname?: string;
        port?: string;
        protocol?: string;
        protocolLong?: string;
        rel?: string;
        rev?: string;
        search?: string;
        shape?: string;
        target?: string;
        text?: string;
        type?: string;
        urn?: string;
    }

    export interface JSXAppletElement extends JSXElement {
        BaseHref?: string;
        align?: string;
        alt?: string;
        altHtml?: string;
        archive?: string;
        border?: string;
        code?: string;
        codeBase?: string;
        codeType?: string;
        contentDocument?: Document;
        data?: string;
        declare?: boolean;
        form?: string;
        height?: string;
        hspace?: number;
        name?: string;
        object?: string;
        standby?: string;
        type?: string;
        useMap?: string;
        vspace?: number;
        width?: number;
    }

    export interface JSXAreaElement extends JSXElement {
        alt?: string;
        coords?: string;
        hash?: string;
        host?: string;
        hostname?: string;
        href?: string;
        noHref?: boolean;
        pathname?: string;
        port?: string;
        protocol?: string;
        rel?: string;
        search?: string;
        shape?: string;
        target?: string;
    }

    export interface JSXAudioElement extends JSXMediaElement {
    }

    export interface JSXBRElement extends JSXElement {
        clear?: string;
    }

    export interface JSXBaseElement extends JSXElement {
        href?: string;
        target?: string;
    }

    export interface JSXBaseFontElement extends JSXElement {
        face?: string;
        size?: number;
    }

    export interface JSXBlockElement extends JSXElement {
        cite?: string;
        clear?: string;
        width?: number;
    }

    export interface JSXBodyElement extends JSXElement {
        aLink?: any;
        background?: string;
        bgColor?: any;
        bgProperties?: string;
        link?: any;
        noWrap?: boolean;
        onafterprint?: (ev?: Event) => any;
        onbeforeprint?: (ev?: Event) => any;
        onbeforeunload?: (ev?: BeforeUnloadEvent) => any;
        onblur?: (ev?: FocusEvent) => any;
        onerror?: (ev?: Event) => any;
        onfocus?: (ev?: FocusEvent) => any;
        onhashchange?: (ev?: HashChangeEvent) => any;
        onload?: (ev?: Event) => any;
        onmessage?: (ev?: MessageEvent) => any;
        onoffline?: (ev?: Event) => any;
        ononline?: (ev?: Event) => any;
        onorientationchange?: (ev?: Event) => any;
        onpagehide?: (ev?: PageTransitionEvent) => any;
        onpageshow?: (ev?: PageTransitionEvent) => any;
        onpopstate?: (ev?: PopStateEvent) => any;
        onresize?: (ev?: UIEvent) => any;
        onstorage?: (ev?: StorageEvent) => any;
        onunload?: (ev?: Event) => any;
        text?: any;
        vLink?: any;
    }

    export interface JSXButtonElement extends JSXElement {
        autofocus?: boolean;
        disabled?: boolean;
        form?: string;
        formAction?: string;
        formEnctype?: string;
        formMethod?: string;
        formNoValidate?: string;
        formTarget?: string;
        name?: string;
        status?: any;
        type?: string;
        validationMessage?: string;
        validity?: ValidityState;
        value?: string;
        willValidate?: boolean;
    }

    export interface JSXCanvasElement extends JSXElement {
        height?: number;
        width?: number;
    }

    export interface JSXDataElement extends JSXElement {
        value?: string;
    }

    export interface JSXDDElement extends JSXElement {
        noWrap?: boolean;
    }

    export interface JSXDetailsElement extends JSXElement {
        open?: boolean;
    }

    export interface JSXDListElement extends JSXElement {
        compact?: boolean;
    }

    export interface JSXDTElement extends JSXElement {
        noWrap?: boolean;
    }

    export interface JSXDataListElement extends JSXElement {
        options?: HTMLCollection;
    }

    export interface JSXDirectoryElement extends JSXElement {
        compact?: boolean;
    }

    export interface JSXDivElement extends JSXElement {
        align?: string;
        noWrap?: boolean;
    }

    export interface JSXEmbedElement extends JSXElement {
        height?: string;
        hidden?: any;
        msPlayToDisabled?: boolean;
        msPlayToPreferredSourceUri?: string;
        msPlayToPrimary?: boolean;
        msPlayToSource?: any;
        name?: string;
        palette?: string;
        pluginspage?: string;
        readyState?: string;
        src?: string;
        units?: string;
        width?: string;
    }

    export interface JSXFieldSetElement extends JSXElement {
        align?: string;
        disabled?: boolean;
        form?: string;
        validationMessage?: string;
        validity?: ValidityState;
        willValidate?: boolean;
    }

    export interface JSXFontElement extends JSXElement {
        face?: string;
    }

    export interface JSXFormElement extends JSXElement {
        acceptCharset?: string;
        action?: string;
        autocomplete?: string;
        elements?: HTMLCollection;
        encoding?: string;
        enctype?: string;
        length?: number;
        method?: string;
        name?: string;
        noValidate?: boolean;
        target?: string;
    }

    export interface JSXFrameElement extends JSXElement {
        border?: string;
        borderColor?: any;
        contentDocument?: Document;
        contentWindow?: Window;
        frameBorder?: string;
        frameSpacing?: any;
        height?: string | number;
        longDesc?: string;
        marginHeight?: string;
        marginWidth?: string;
        name?: string;
        noResize?: boolean;
        onload?: (ev?: Event) => any;
        scrolling?: string;
        security?: any;
        src?: string;
        width?: string | number;
    }

    export interface JSXFrameSetElement extends JSXElement {
        border?: string;
        borderColor?: any;
        cols?: string;
        frameBorder?: string;
        frameSpacing?: any;
        name?: string;
        onafterprint?: (ev?: Event) => any;
        onbeforeprint?: (ev?: Event) => any;
        onbeforeunload?: (ev?: BeforeUnloadEvent) => any;
        onblur?: (ev?: FocusEvent) => any;
        onerror?: (ev?: Event) => any;
        onfocus?: (ev?: FocusEvent) => any;
        onhashchange?: (ev?: HashChangeEvent) => any;
        onload?: (ev?: Event) => any;
        onmessage?: (ev?: MessageEvent) => any;
        onoffline?: (ev?: Event) => any;
        ononline?: (ev?: Event) => any;
        onorientationchange?: (ev?: Event) => any;
        onpagehide?: (ev?: PageTransitionEvent) => any;
        onpageshow?: (ev?: PageTransitionEvent) => any;
        onresize?: (ev?: UIEvent) => any;
        onstorage?: (ev?: StorageEvent) => any;
        onunload?: (ev?: Event) => any;
        rows?: string;
    }

    export interface JSXHRElement extends JSXElement {
        align?: string;
        noShade?: boolean;
        width?: number;
    }

    export interface JSXHeadElement extends JSXElement {
        profile?: string;
    }

    export interface JSXHeadingElement extends JSXElement {
        align?: string;
        clear?: string;
    }

    export interface JSXHtmlElement extends JSXElement {
        version?: string;
    }

    export interface JSXIFrameElement extends JSXElement {
        align?: string;
        allowFullscreen?: boolean;
        border?: string;
        contentDocument?: Document;
        contentWindow?: Window;
        frameBorder?: string;
        frameSpacing?: any;
        height?: string;
        hspace?: number;
        longDesc?: string;
        marginHeight?: string;
        marginWidth?: string;
        name?: string;
        noResize?: boolean;
        onload?: (ev?: Event) => any;
        sandbox?: DOMSettableTokenList;
        scrolling?: string;
        security?: any;
        src?: string;
        vspace?: number;
        width?: string;
    }

    export interface JSXImageElement extends JSXElement {
        align?: string;
        alt?: string;
        border?: string;
        complete?: boolean;
        crossOrigin?: string;
        currentSrc?: string;
        height?: number;
        hspace?: number;
        isMap?: boolean;
        longDesc?: string;
        msPlayToDisabled?: boolean;
        msPlayToPreferredSourceUri?: string;
        msPlayToPrimary?: boolean;
        msPlayToSource?: any;
        name?: string;
        naturalHeight?: number;
        naturalWidth?: number;
        src?: string;
        srcset?: string;
        useMap?: string;
        vspace?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    export interface JSXInputElement extends JSXElement {
        accept?: string;
        align?: string;
        alt?: string;
        autocomplete?: string;
        autofocus?: boolean;
        border?: string;
        checked?: boolean;
        complete?: boolean;
        defaultChecked?: boolean;
        defaultValue?: string;
        disabled?: boolean;
        files?: FileList;
        form?: string;
        formAction?: string;
        formEnctype?: string;
        formMethod?: string;
        formNoValidate?: string;
        formTarget?: string;
        height?: string;
        hspace?: number;
        indeterminate?: boolean;
        list?: HTMLElement;
        max?: string;
        maxLength?: number;
        min?: string;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        selectionEnd?: number;
        selectionStart?: number;
        size?: number;
        src?: string;
        status?: boolean;
        step?: string;
        type?: string;
        useMap?: string;
        validationMessage?: string;
        validity?: ValidityState;
        value?: string;
        valueAsDate?: Date;
        valueAsNumber?: number;
        vspace?: number;
        width?: string;
        willValidate?: boolean;
    }

    export interface JSXIsIndexElement extends JSXElement {
        action?: string;
        form?: string;
        prompt?: string;
    }

    export interface JSXKeygenElement extends JSXElement {
        autofocus?: boolean;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keytype?: string;
        name?: string;
        type?: string;
        willValidate?: boolean;
    }

    export interface JSXLIElement extends JSXElement {
        type?: string;
        value?: number;
    }

    export interface JSXLabelElement extends JSXElement {
        form?: string;
        htmlFor?: string;
    }

    export interface JSXLegendElement extends JSXElement {
        align?: string;
        form?: string;
    }

    export interface JSXLinkElement extends JSXElement {
        charset?: string;
        disabled?: boolean;
        href?: string;
        hreflang?: string;
        media?: string;
        rel?: string;
        rev?: string;
        target?: string;
        type?: string;
    }

    export interface JSXMapElement extends JSXElement {
        areas?: HTMLAreasCollection;
        name?: string;
    }

    export interface JSXMarqueeElement extends JSXElement {
        behavior?: string;
        bgColor?: any;
        direction?: string;
        height?: string;
        hspace?: number;
        loop?: number;
        onbounce?: (ev?: Event) => any;
        onfinish?: (ev?: Event) => any;
        onstart?: (ev?: Event) => any;
        scrollAmount?: number;
        scrollDelay?: number;
        trueSpeed?: boolean;
        vspace?: number;
        width?: string;
    }

    export interface JSXMediaElement extends JSXElement {
        audioTracks?: AudioTrackList;
        autoplay?: boolean;
        buffered?: TimeRanges;
        controls?: boolean;
        currentSrc?: string;
        currentTime?: number;
        defaultMuted?: boolean;
        defaultPlaybackRate?: number;
        duration?: number;
        ended?: boolean;
        error?: MediaError;
        loop?: boolean;
        msAudioCategory?: string;
        msAudioDeviceType?: string;
        msGraphicsTrustStatus?: MSGraphicsTrust;
        msKeys?: MSMediaKeys;
        msPlayToDisabled?: boolean;
        msPlayToPreferredSourceUri?: string;
        msPlayToPrimary?: boolean;
        msPlayToSource?: any;
        msRealTime?: boolean;
        muted?: boolean;
        networkState?: number;
        onmsneedkey?: (ev?: MSMediaKeyNeededEvent) => any;
        paused?: boolean;
        playbackRate?: number;
        played?: TimeRanges;
        preload?: string;
        readyState?: number;
        seekable?: TimeRanges;
        seeking?: boolean;
        src?: string;
        textTracks?: TextTrackList;
        videoTracks?: VideoTrackList;
        volume?: number;
        HAVE_CURRENT_DATA: number;
        HAVE_ENOUGH_DATA: number;
        HAVE_FUTURE_DATA: number;
        HAVE_METADATA: number;
        HAVE_NOTHING: number;
        NETWORK_EMPTY: number;
        NETWORK_IDLE: number;
        NETWORK_LOADING: number;
        NETWORK_NO_SOURCE: number;
    }

    export interface JSXMenuElement extends JSXElement {
        compact?: boolean;
        type?: string;
    }

    export interface JSXMetaElement extends JSXElement {
        charset?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
        scheme?: string;
        url?: string;
    }

    export interface JSXMeterElement extends JSXElement {
        high?: number;
        low?: number;
        max?: number;
        min?: number;
        optimum?: number;
        labels?: string;
    }

    export interface JSXModElement extends JSXElement {
        cite?: string;
        dateTime?: string;
    }

    export interface JSXNextIdElement extends JSXElement {
        n?: string;
    }

    export interface JSXOListElement extends JSXElement {
        compact?: boolean;
        start?: number;
        type?: string;
    }

    export interface JSXObjectElement extends JSXElement {
        BaseHref?: string;
        align?: string;
        alt?: string;
        altHtml?: string;
        archive?: string;
        border?: string;
        code?: string;
        codeBase?: string;
        codeType?: string;
        contentDocument?: Document;
        data?: string;
        declare?: boolean;
        form?: string;
        height?: string;
        hspace?: number;
        msPlayToDisabled?: boolean;
        msPlayToPreferredSourceUri?: string;
        msPlayToPrimary?: boolean;
        msPlayToSource?: any;
        name?: string;
        object?: any;
        readyState?: number;
        standby?: string;
        type?: string;
        useMap?: string;
        validationMessage?: string;
        validity?: ValidityState;
        vspace?: number;
        width?: string;
        willValidate?: boolean;
    }

    export interface JSXOptGroupElement extends JSXElement {
        defaultSelected?: boolean;
        disabled?: boolean;
        form?: string;
        index?: number;
        label?: string;
        selected?: boolean;
        text?: string;
        value?: string;
    }

    export interface JSXOptionElement extends JSXElement {
        defaultSelected?: boolean;
        disabled?: boolean;
        form?: string;
        index?: number;
        label?: string;
        selected?: boolean;
        text?: string;
        value?: string;
    }

    export interface JSXOutputElement extends JSXElement {
        defaultValue?: string;
        form?: string;
        labels?: string;
        name?: string;
        type?: string;
        validationMessage?: string;
        validity?: ValidityState;
        value?: string;
        willValidate?: boolean;
    }

    export interface JSXParagraphElement extends JSXElement {
        align?: string;
        clear?: string;
    }

    export interface JSXParamElement extends JSXElement {
        name?: string;
        type?: string;
        value?: string;
        valueType?: string;
    }

    export interface JSXPhraseElement extends JSXElement {
        cite?: string;
        dateTime?: string;
    }

    export interface JSXPreElement extends JSXElement {
        cite?: string;
        clear?: string;
        width?: number;
    }

    export interface JSXProgressElement extends JSXElement {
        form?: string;
        max?: number;
        position?: number;
        value?: number;
    }

    export interface JSXQuoteElement extends JSXElement {
        cite?: string;
        dateTime?: string;
    }

    export interface JSXScriptElement extends JSXElement {
        async?: boolean;
        charset?: string;
        defer?: boolean;
        event?: string;
        htmlFor?: string;
        src?: string;
        text?: string;
        type?: string;
    }

    export interface JSXSelectElement extends JSXElement {
        autofocus?: boolean;
        disabled?: boolean;
        form?: string;
        length?: number;
        multiple?: boolean;
        name?: string;
        options?: HTMLCollection;
        required?: boolean;
        selectedIndex?: number;
        size?: number;
        type?: string;
        validationMessage?: string;
        validity?: ValidityState;
        value?: string;
        willValidate?: boolean;
        selectedOptions?: HTMLCollection;
    }

    export interface JSXSourceElement extends JSXElement {
        media?: string;
        msKeySystem?: string;
        src?: string;
        type?: string;
    }

    export interface JSXSpanElement extends JSXElement {
    }

    export interface JSXStyleElement extends JSXElement {
        media?: string;
        type?: string;
    }

    export interface JSXTableCaptionElement extends JSXElement {
        align?: string;
        vAlign?: string;
    }

    export interface JSXTableAlignment {
        ch?: string;
        chOff?: string;
        vAlign?: string;
    }

    export interface JSXTableCellElement extends JSXElement, JSXTableAlignment {
        abbr?: string;
        align?: string;
        axis?: string;
        bgColor?: any;
        cellIndex?: number;
        colSpan?: number;
        headers?: string;
        height?: any;
        noWrap?: boolean;
        rowSpan?: number;
        scope?: string;
        width?: string;
    }

    export interface JSXTableColElement extends JSXElement, JSXTableAlignment {
        align?: string;
        span?: number;
        width?: any;
    }

    export interface JSXTableDataCellElement extends JSXTableCellElement {
    }

    export interface JSXTableElement extends JSXElement {
        align?: string;
        bgColor?: any;
        border?: string;
        borderColor?: any;
        caption?: HTMLTableCaptionElement;
        cellPadding?: string;
        cellSpacing?: string;
        cols?: number;
        frame?: string;
        height?: any;
        rows?: HTMLCollection;
        rules?: string;
        summary?: string;
        tBodies?: HTMLCollection;
        tFoot?: HTMLTableSectionElement;
        tHead?: HTMLTableSectionElement;
        width?: string;
    }

    export interface JSXTableHeaderCellElement extends JSXTableCellElement {
        scope?: string;
    }

    export interface JSXTableRowElement extends JSXElement, JSXTableAlignment {
        align?: string;
        bgColor?: any;
        cells?: HTMLCollection;
        height?: any;
        rowIndex?: number;
        sectionRowIndex?: number;
    }

    export interface JSXTableSectionElement extends JSXElement, JSXTableAlignment {
        align?: string;
        rows?: HTMLCollection;
    }

    export interface JSXTextAreaElement extends JSXElement {
        autofocus?: boolean;
        cols?: number;
        defaultValue?: string;
        disabled?: boolean;
        form?: string;
        maxLength?: number;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        rows?: number;
        selectionEnd?: number;
        selectionStart?: number;
        status?: any;
        type?: string;
        validationMessage?: string;
        validity?: ValidityState;
        value?: string;
        willValidate?: boolean;
        wrap?: string;
    }

    export interface JSXTimeElement extends JSXElement {
        dateTime?: string;
    }

    export interface JSXTitleElement extends JSXElement {
        text?: string;
    }

    export interface JSXTrackElement extends JSXElement {
        default?: boolean;
        kind?: string;
        label?: string;
        readyState?: number;
        src?: string;
        srclang?: string;
        track?: TextTrack;
        ERROR?: number;
        LOADED?: number;
        LOADING?: number;
        NONE?: number;
    }

    export interface JSXUListElement extends JSXElement {
        compact?: boolean;
        type?: string;
    }

    export interface JSXUnknownElement extends JSXElement {
    }

    export interface JSXVideoElement extends JSXMediaElement {
        height?: number;
        msHorizontalMirror?: boolean;
        msIsLayoutOptimalForPlayback?: boolean;
        msIsStereo3D?: boolean;
        msStereo3DPackingMode?: string;
        msStereo3DRenderMode?: string;
        msZoom?: boolean;
        onMSVideoFormatChanged?: (ev?: Event) => any;
        onMSVideoFrameStepCompleted?: (ev?: Event) => any;
        onMSVideoOptimalLayoutChanged?: (ev?: Event) => any;
        poster?: string;
        videoHeight?: number;
        videoWidth?: number;
        webkitDisplayingFullscreen?: boolean;
        webkitSupportsFullscreen?: boolean;
        width?: number;
    }
}
