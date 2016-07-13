declare var window: any;
import TestRunner from './TestRunner';
import './graph/test0';
import './graph/test1';
import './graph/test2';
import './graph/test3';
import './graph/test4';
import './graph/test5';
import './graph/test6';
import './graph/test7';
import './graph/test8';
import './graph/test9';
import './graph/test10';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
