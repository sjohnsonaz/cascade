/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import 'es6-shim';
import 'reflect-metadata';

let $IEVersion: number = (function () {
    let { userAgent } = window.navigator;
    let matches = userAgent.match(/MSIE ([0-9\.]*)/);
    if (matches) {
        return parseInt(matches[1]);
    }
    matches = userAgent.match(/Trident\/([0-9\.]*)/);
    if (matches) {
        return 11;
    }
    matches = userAgent.match(/Edge\/([0-9\.]*)/);
    if (matches) {
        return parseInt(matches[1]);
    }
    return 0;
})();

window['$IEVersion'] = $IEVersion;

import '../tests/Cascade.createObservable_Test';
import '../tests/Cascade.createObservableArray_Test';
import '../tests/Cascade.createObservableHash_Test';
import '../tests/Cascade.render_Component_Test';
import '../tests/Component.portal_Test';
import '../tests/cascadeTest1';
import '../tests/cascadeTest2';
import '../tests/cascadeTest3';
import '../tests/cascadeTest4';
import '../tests/cascadeTest5';
import '../tests/cascadeTest6';
import '../tests/cascadeTest7';
import '../tests/cascadeTest9';
import '../tests/cascadeTest10';
import '../tests/Component.diff_Test';
import '../tests/Component.diff_Nested_Children_Test';
import '../tests/Component.dispose_Test';
import '../tests/Component.toNode_Test';
import '../tests/Component.update_Test';
import '../tests/ComponentTest';
import '../tests/ComputedTest';
import '../tests/DecoratorUtil_Test';
import '../tests/diffTest';
import '../tests/documentTest';
import '../tests/Fragment_Test';
import '../tests/graphTest0';
import '../tests/graphTest1';
import '../tests/graphTest2';
import '../tests/graphTest3';
import '../tests/graphTest4';
import '../tests/graphTest5';
import '../tests/graphTest6';
import '../tests/graphTest7';
import '../tests/graphTest8';
import '../tests/Observable_Decorator_Test';
import '../tests/Observable_Test';
import '../tests/ObservableArray_Decorator_Test';
import '../tests/ObservableArray_Test';
import '../tests/ObservableArrayLegacy_Test';
import '../tests/ObservableHash_Decorator_Test';
import '../tests/ObservableHash_Test';
import '../tests/Subscribe_Test';
import '../tests/VirtualNode.toNode_Test';
