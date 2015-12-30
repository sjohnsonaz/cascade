window.onload = function () {
    window.template = Template.parse('\
        <div>\
            <div>test0</div>\
            {{ test1 }}\
            <div>test2</div>\
            <div data-handler="html" data-bind="a"></div>\
            <div data-handler="with" data-bind="$child(\'user\')">\
                <div data-handler="html" data-bind="firstName"></div>\
            </div>\
        </div>\
    ');
    window.viewModel = {
        a: '1234',
        b: {
            c: 'abcd'
        },
        user: new User('Sean', 'Johnson')
    };
    window.builtTemplate = Template.build(template, viewModel);
    document.body.appendChild(builtTemplate);
    console.log(template);
};
