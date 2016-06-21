declare var window: any;
import TestRunner from './TestRunner';
import './cascade/test0';
import './cascade/test1';
import './cascade/test2';
import './cascade/test3';
import './cascade/test4';
import './cascade/test5';
import './cascade/test6';
import './cascade/test8';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
