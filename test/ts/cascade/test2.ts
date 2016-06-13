import TestRunner from '../TestRunner';
import Template from '../../../src/cascade/Template';

TestRunner.test({
    name: 'Values can be used in a Template.',
    test: function (input, callback) {
        var viewModel = {
            showFirst: true,
            showSecond: false,
            valueFirst: 'abcd',
            valueSecond: 'efgh'
        };
        var template = new Template('\r\n\
            @if: showFirst {\r\n\
                <div id="testFirst" data-bind="html: valueFirst"></div>\r\n\
            }\r\n\
            @if: showSecond {\r\n\
                <div id="testSecond" data-bind="html: valueSecond"></div>\r\n\
        	}\r\n\
        ');
        callback(template.build(viewModel));
    },
    assert: function (result, callback) {
        var testFirst = result.getElementById("testFirst");
        var testSecond = result.getElementById("testSecond");
        callback(testFirst && testFirst.innerHTML == 'abcd' && !testSecond);
    }
});
