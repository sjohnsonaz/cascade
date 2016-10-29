declare var window: any;
import TestRunner from './TestRunner';
import './cascade/test3';
import './cascade/test4';
import './cascade/test5';
import './cascade/test6';
import './cascade/test7';
import './cascade/test8';
import './cascade/test9';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
