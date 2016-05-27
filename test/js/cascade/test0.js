TestRunner.test({
    name: 'Text can be parsed into a Template and fragment',
    test: function (input, callback) {
        var template = new Template('\
            <h1>Widget Demo</h1>\
            @if: false {\
                <div>boolean constant false</div>\
            }\
            @if: true {\
                <div>boolean constant true</div>\
        	}\
        ');
        document.body.appendChild(template.build());
        callback(template);
    },
    assert: function (result, callback) {
        console.log(result);
        callback(true);
    }
});
