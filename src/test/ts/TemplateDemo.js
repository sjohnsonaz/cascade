window.onload = function () {
    window.template = Template.parse('\
        <div>\
            <div>test0</div>\
            {{ test1 }}\
            <div>test2</div>\
            <div data-handler="html" data-bind="a"></div>\
            <div data-handler="with" data-bind="$child(\'b\')">\
                <div data-handler="html" data-bind="c"></div>\
            </div>\
        </div>\
    ');
    window.viewModel = {
        a: '1234',
        b: {
            c: 'abcd'
        }
    };
    window.builtTemplate = Template.build(template, viewModel);
    document.body.appendChild(builtTemplate);
    console.log(template);
};
