import TestRunner from '../TestRunner';
import Template from '../../../scripts/cascade/Template';

TestRunner.test({
    name: 'Conditional bindings control node creation.',
    test: function (input, callback) {
        var template = new Template('\r\n\
            <div>always render</div>\r\n\
            @if: false {\r\n\
                <div id="testFalse">boolean constant false</div>\r\n\
            }\r\n\
            @if: true {\r\n\
                <div id="testTrue">boolean constant true</div>\r\n\
        	}\r\n\
        ');
        callback(template.build());
    },
    assert: function (result, callback) {
        var testFalse = result.getElementById("testFalse");
        var testTrue = result.getElementById("testTrue");
        callback(testTrue && !testFalse);
    }
});
