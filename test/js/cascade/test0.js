TestRunner.test({
    name: 'Text can be parsed into a Template and fragment',
    test: function (input, callback) {
        var template = new Template('\r\n\
            <h1>Widget Demo</h1>\r\n\
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
        document.body.appendChild(result);
        var testFalse = document.getElementById("testFalse");
        var testTrue = document.getElementById("testTrue");
        callback(testTrue && !testFalse);
    }
});
