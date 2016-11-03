declare var window: any;

import TestRunner from '../TestRunner';
import './test0';
import './test1';
import './test2';
import './test3';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
