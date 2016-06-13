declare var window: any;
import TestRunner from './TestRunner';
import './cascade/test0';
import './cascade/test1';
import './cascade/test2';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
