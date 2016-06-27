import TestRunner from '../TestRunner';
import Template from '../../../scripts/template/Template';

TestRunner.test({
    name: 'Text can be parsed into a Template and fragment',
    test: function (input, callback: any) {
        var template = new Template('\r\n\
            <div id="testNode">Test Node</div>\r\n\
        ');
        callback(template.build());
    },
    assert: function (result, callback) {
        var testNode = result.getElementById("testNode");
        callback(!!testNode);
    }
});
