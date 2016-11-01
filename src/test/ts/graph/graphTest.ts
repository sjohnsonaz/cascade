declare var window: any;
import TestRunner from '../TestRunner';
import './test0';
import './test1';
import './test2';
import './test3';
import './test4';
import './test5';
import './test6';
import './test7';
import './test8';
import './test9';
import './test10';

window.onload = function() {
    TestRunner.run(function(output) {
        window.tests = output;
    });
};
