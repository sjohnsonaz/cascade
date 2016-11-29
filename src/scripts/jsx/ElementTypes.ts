import {IVirtualNodeProps} from '../cascade/IVirtualNode';

export namespace ElementTypes {
    export interface CascadeNode {
        nodeValue?: string;
        textContent?: string;
        [name: string]: any;
    }

    export interface CascadeElement extends CascadeNode, IVirtualNodeProps {
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

    export interface CascadeHTMLElement extends CascadeElement {
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
        tabIndex?: number;
        title?: string;
    }

    export interface CascadeSVGElement extends CascadeElement {
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

    export interface CascadeAnchorElement extends CascadeHTMLElement {
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

    export interface CascadeAppletElement extends CascadeHTMLElement {
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

    export interface CascadeAreaElement extends CascadeHTMLElement {
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

    export interface CascadeAudioElement extends CascadeMediaElement {
    }

    export interface CascadeBRElement extends CascadeHTMLElement {
        clear?: string;
    }

    export interface CascadeBaseElement extends CascadeHTMLElement {
        href?: string;
        target?: string;
    }

    export interface CascadeBaseFontElement extends CascadeHTMLElement {
        face?: string;
        size?: number;
    }

    export interface CascadeBlockElement extends CascadeHTMLElement {
        cite?: string;
        clear?: string;
        width?: number;
    }

    export interface CascadeBodyElement extends CascadeHTMLElement {
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

    export interface CascadeButtonElement extends CascadeHTMLElement {
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

    export interface CascadeCanvasElement extends CascadeHTMLElement {
        height?: number;
        width?: number;
    }

    export interface CascadeDataElement extends CascadeHTMLElement {
        value?: string;
    }

    export interface CascadeDDElement extends CascadeHTMLElement {
        noWrap?: boolean;
    }

    export interface CascadeDetailsElement extends CascadeHTMLElement {
        open?: boolean;
    }

    export interface CascadeDListElement extends CascadeHTMLElement {
        compact?: boolean;
    }

    export interface CascadeDTElement extends CascadeHTMLElement {
        noWrap?: boolean;
    }

    export interface CascadeDataListElement extends CascadeHTMLElement {
        options?: HTMLCollection;
    }

    export interface CascadeDirectoryElement extends CascadeHTMLElement {
        compact?: boolean;
    }

    export interface CascadeDivElement extends CascadeHTMLElement {
        align?: string;
        noWrap?: boolean;
    }

    export interface CascadeEmbedElement extends CascadeHTMLElement {
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

    export interface CascadeFieldSetElement extends CascadeHTMLElement {
        align?: string;
        disabled?: boolean;
        form?: string;
        validationMessage?: string;
        validity?: ValidityState;
        willValidate?: boolean;
    }

    export interface CascadeFontElement extends CascadeHTMLElement {
        face?: string;
    }

    export interface CascadeFormElement extends CascadeHTMLElement {
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

    export interface CascadeFrameElement extends CascadeHTMLElement {
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

    export interface CascadeFrameSetElement extends CascadeHTMLElement {
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

    export interface CascadeHRElement extends CascadeHTMLElement {
        align?: string;
        noShade?: boolean;
        width?: number;
    }

    export interface CascadeHeadElement extends CascadeHTMLElement {
        profile?: string;
    }

    export interface CascadeHeadingElement extends CascadeHTMLElement {
        align?: string;
        clear?: string;
    }

    export interface CascadeHTMLHtmlElement extends CascadeHTMLElement {
        version?: string;
    }

    export interface CascadeIFrameElement extends CascadeHTMLElement {
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

    export interface CascadeImageElement extends CascadeHTMLElement {
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

    export interface CascadeInputElement extends CascadeHTMLElement {
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

    export interface CascadeIsIndexElement extends CascadeHTMLElement {
        action?: string;
        form?: string;
        prompt?: string;
    }

    export interface CascadeKeygenElement extends CascadeHTMLElement {
        autofocus?: boolean;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keytype?: string;
        name?: string;
        type?: string;
        willValidate?: boolean;
    }

    export interface CascadeLIElement extends CascadeHTMLElement {
        type?: string;
        value?: number;
    }

    export interface CascadeLabelElement extends CascadeHTMLElement {
        form?: string;
        htmlFor?: string;
    }

    export interface CascadeLegendElement extends CascadeHTMLElement {
        align?: string;
        form?: string;
    }

    export interface CascadeLinkElement extends CascadeHTMLElement {
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

    export interface CascadeMapElement extends CascadeHTMLElement {
        areas?: HTMLAreasCollection;
        name?: string;
    }

    export interface CascadeMarqueeElement extends CascadeHTMLElement {
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

    export interface CascadeMediaElement extends CascadeHTMLElement {
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

    export interface CascadeMenuElement extends CascadeHTMLElement {
        compact?: boolean;
        type?: string;
    }

    export interface CascadeMetaElement extends CascadeHTMLElement {
        charset?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
        scheme?: string;
        url?: string;
    }

    export interface CascadeMeterElement extends CascadeHTMLElement {
        high?: number;
        low?: number;
        max?: number;
        min?: number;
        optimum?: number;
        labels?: string;
    }

    export interface CascadeModElement extends CascadeHTMLElement {
        cite?: string;
        dateTime?: string;
    }

    export interface CascadeNextIdElement extends CascadeHTMLElement {
        n?: string;
    }

    export interface CascadeOListElement extends CascadeHTMLElement {
        compact?: boolean;
        start?: number;
        type?: string;
    }

    export interface CascadeObjectElement extends CascadeHTMLElement {
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

    export interface CascadeOptGroupElement extends CascadeHTMLElement {
        defaultSelected?: boolean;
        disabled?: boolean;
        form?: string;
        index?: number;
        label?: string;
        selected?: boolean;
        text?: string;
        value?: string;
    }

    export interface CascadeOptionElement extends CascadeHTMLElement {
        defaultSelected?: boolean;
        disabled?: boolean;
        form?: string;
        index?: number;
        label?: string;
        selected?: boolean;
        text?: string;
        value?: string;
    }

    export interface CascadeOutputElement extends CascadeHTMLElement {
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

    export interface CascadeParagraphElement extends CascadeHTMLElement {
        align?: string;
        clear?: string;
    }

    export interface CascadeParamElement extends CascadeHTMLElement {
        name?: string;
        type?: string;
        value?: string;
        valueType?: string;
    }

    export interface CascadePhraseElement extends CascadeHTMLElement {
        cite?: string;
        dateTime?: string;
    }

    export interface CascadePreElement extends CascadeHTMLElement {
        cite?: string;
        clear?: string;
        width?: number;
    }

    export interface CascadeProgressElement extends CascadeHTMLElement {
        form?: string;
        max?: number;
        position?: number;
        value?: number;
    }

    export interface CascadeQuoteElement extends CascadeHTMLElement {
        cite?: string;
        dateTime?: string;
    }

    export interface CascadeScriptElement extends CascadeHTMLElement {
        async?: boolean;
        charset?: string;
        defer?: boolean;
        event?: string;
        htmlFor?: string;
        src?: string;
        text?: string;
        type?: string;
    }

    export interface CascadeSelectElement extends CascadeHTMLElement {
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

    export interface CascadeSourceElement extends CascadeHTMLElement {
        media?: string;
        msKeySystem?: string;
        src?: string;
        type?: string;
    }

    export interface CascadeSpanElement extends CascadeHTMLElement {
    }

    export interface CascadeStyleElement extends CascadeHTMLElement {
        media?: string;
        type?: string;
    }

    export interface CascadeTableCaptionElement extends CascadeHTMLElement {
        align?: string;
        vAlign?: string;
    }

    export interface CascadeTableAlignment {
        ch?: string;
        chOff?: string;
        vAlign?: string;
    }

    export interface CascadeTableCellElement extends CascadeHTMLElement, CascadeTableAlignment {
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

    export interface CascadeTableColElement extends CascadeHTMLElement, CascadeTableAlignment {
        align?: string;
        span?: number;
        width?: any;
    }

    export interface CascadeTableDataCellElement extends CascadeTableCellElement {
    }

    export interface CascadeTableElement extends CascadeHTMLElement {
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

    export interface CascadeTableHeaderCellElement extends CascadeTableCellElement {
        scope?: string;
    }

    export interface CascadeTableRowElement extends CascadeHTMLElement, CascadeTableAlignment {
        align?: string;
        bgColor?: any;
        cells?: HTMLCollection;
        height?: any;
        rowIndex?: number;
        sectionRowIndex?: number;
    }

    export interface CascadeTableSectionElement extends CascadeHTMLElement, CascadeTableAlignment {
        align?: string;
        rows?: HTMLCollection;
    }

    export interface CascadeTextAreaElement extends CascadeHTMLElement {
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

    export interface CascadeTimeElement extends CascadeHTMLElement {
        dateTime?: string;
    }

    export interface CascadeTitleElement extends CascadeHTMLElement {
        text?: string;
    }

    export interface CascadeTrackElement extends CascadeHTMLElement {
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

    export interface CascadeUListElement extends CascadeHTMLElement {
        compact?: boolean;
        type?: string;
    }

    export interface CascadeUnknownElement extends CascadeHTMLElement {
    }

    export interface CascadeVideoElement extends CascadeMediaElement {
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
