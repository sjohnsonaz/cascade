import { IVirtualNodeProps } from '../modules/Cascade';

export type JSXElement<T extends Element> = IVirtualNodeProps & Partial<T>;

export interface SVGElements {
    animate: JSXElement<SVGElement>;// Missing definition
    animateColor: JSXElement<SVGElement>;// Missing definition
    animateMotion: JSXElement<SVGElement>;// Missing definition
    animateTransform: JSXElement<SVGElement>;// Missing definition
    circle: JSXElement<SVGCircleElement>;
    clipPath: JSXElement<SVGClipPathElement>;
    "colorprofile": JSXElement<SVGElement>;// Missing definition
    cursor: JSXElement<SVGElement>;// Missing definition
    defs: JSXElement<SVGDefsElement>;
    desc: JSXElement<SVGDescElement>;
    discard: JSXElement<SVGElement>;// Missing definition
    ellipse: JSXElement<SVGEllipseElement>;
    feBlend: JSXElement<SVGFEBlendElement>;
    feColorMatrix: JSXElement<SVGFEColorMatrixElement>;
    feComponentTransfer: JSXElement<SVGFEComponentTransferElement>;
    feComposite: JSXElement<SVGFECompositeElement>;
    feConvolveMatrix: JSXElement<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: JSXElement<SVGFEDiffuseLightingElement>;
    feDisplacementMap: JSXElement<SVGFEDisplacementMapElement>;
    feDistantLight: JSXElement<SVGFEDistantLightElement>;
    feDropShadow: JSXElement<SVGElement>;// Missing definition
    feFlood: JSXElement<SVGFEFloodElement>;
    feFuncA: JSXElement<SVGFEFuncAElement>;
    feFuncB: JSXElement<SVGFEFuncBElement>;
    feFuncG: JSXElement<SVGFEFuncGElement>;
    feFuncR: JSXElement<SVGFEFuncRElement>;
    feGaussianBlur: JSXElement<SVGFEGaussianBlurElement>;
    feImage: JSXElement<SVGFEImageElement>;
    feMerge: JSXElement<SVGFEMergeElement>;
    feMergeNode: JSXElement<SVGFEMergeNodeElement>;
    feMorphology: JSXElement<SVGFEMorphologyElement>;
    feOffset: JSXElement<SVGFEOffsetElement>;
    fePointLight: JSXElement<SVGFEPointLightElement>;
    feSpecularLighting: JSXElement<SVGFESpecularLightingElement>;
    feSpotLight: JSXElement<SVGFESpotLightElement>;
    feTile: JSXElement<SVGFETileElement>;
    feTurbulence: JSXElement<SVGFETurbulenceElement>;
    filter: JSXElement<SVGFilterElement>;
    font: JSXElement<SVGElement>;// Missing definition
    "font-face": JSXElement<SVGElement>;// Missing definition
    "font-face-format": JSXElement<SVGElement>;// Missing definition
    "font-face-name": JSXElement<SVGElement>;// Missing definition
    "font-face-src": JSXElement<SVGElement>;// Missing definition
    "font-face-uri": JSXElement<SVGElement>;// Missing definition
    foreignObject: JSXElement<SVGForeignObjectElement>;
    g: JSXElement<SVGGElement>;
    glyph: JSXElement<SVGElement>;// Missing definition
    glyphRef: JSXElement<SVGElement>;// Missing definition
    hatch: JSXElement<SVGElement>;// Missing definition
    hatchpath: JSXElement<SVGElement>;// Missing definition
    hkern: JSXElement<SVGElement>;// Missing definition
    image: JSXElement<SVGImageElement>;
    line: JSXElement<SVGLineElement>;
    linearGradient: JSXElement<SVGLinearGradientElement>;
    marker: JSXElement<SVGMarkerElement>;
    mask: JSXElement<SVGMaskElement>;
    mesh: JSXElement<SVGElement>;// Missing definition
    meshgradient: JSXElement<SVGElement>;// Missing definition
    meshpatch: JSXElement<SVGElement>;// Missing definition
    meshrow: JSXElement<SVGElement>;// Missing definition
    metadata: JSXElement<SVGMetadataElement>;
    "missing-glyph": JSXElement<SVGElement>;// Missing definition
    mpath: JSXElement<SVGElement>;// Missing definition
    path: JSXElement<SVGPathElement>;
    pattern: JSXElement<SVGPatternElement>;
    polygon: JSXElement<SVGPolygonElement>;
    polyline: JSXElement<SVGPolylineElement>;
    radialGradient: JSXElement<SVGRadialGradientElement>;
    rect: JSXElement<SVGRectElement>;
    //script: JSXElement<SVGScriptElement>;// Duplicate of HTMLElements
    set: JSXElement<SVGStyleElement>;
    solidcolor: JSXElement<SVGElement>;// Missing definition
    stop: JSXElement<SVGStopElement>;
    //style: JSXElement<SVGStyleElement>;// Duplicate of HTMLElements
    svg: JSXElement<SVGSVGElement>;
    switch: JSXElement<SVGSwitchElement>;
    symbol: JSXElement<SVGSymbolElement>;
    text: JSXElement<SVGTextElement>;
    textPath: JSXElement<SVGTextPathElement>;
    //title: JSXElement<SVGTitleElement>;// Duplicate of HTMLElements
    tref: JSXElement<SVGElement>;// Missing definition
    tspan: JSXElement<SVGTSpanElement>;
    unknown: JSXElement<SVGElement>;// Missing definition
    use: JSXElement<SVGUseElement>;
    view: JSXElement<SVGViewElement>;
    vkern: JSXElement<SVGElement>;// Missing definition
}