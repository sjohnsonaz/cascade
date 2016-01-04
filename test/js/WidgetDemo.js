window.onload = function () {
    window.template = Template.parse('\
        <div>\
            <div>test0</div>\
            {{ test1 }}\
            <div>test2</div>\
            <div data-bind="html: a"></div>\
            <div data-bind="with: $child(\'user\')">\
                <span data-bind="html: firstName"></span>\
                <span data-bind="html: lastName"></span>\
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
