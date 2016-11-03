import TestRunner from '../TestRunner';
import Template from '../../../scripts/template/Template';

TestRunner.test({
    name: 'Values can be used in a Template.',
    test: function(input, callback) {
        var viewModel = {
            a: '1234',
            b: {
                c: 'abcd'
            }
        };
        var template = new Template('\
            <div>\
                <div>test0</div>\
                {{ test1 }}\
                <div>test2</div>\
                <div data-bind="html: a"></div>\
                <div data-bind="with: b">\
                    <div data-bind="html: b.c"></div>\
                </div>\
            </div>\
        ');
        var builtTemplate = template.build(viewModel)
        document.body.appendChild(builtTemplate);
        callback(builtTemplate);
    },
    assert: function(result, callback) {
        callback(true);
    }
});
