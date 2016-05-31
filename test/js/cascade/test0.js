TestRunner.test({
    name: 'Text can be parsed into a Template and fragment',
    test: function (input, callback) {
        var template = new Template('\r\n\
            <h1>Widget Demo</h1>\r\n\
            @if: false {\r\n\
                <div>boolean constant false</div>\r\n\
            }\r\n\
            @if: true {\r\n\
                <div>boolean constant true</div>\r\n\
        	}\r\n\
        ');
        document.body.appendChild(template.build());
        callback(template);
    },
    assert: function (result, callback) {
        console.log(result);
        callback(true);
    }
});
