window.onload = function () {
    window.template = Template.parse('\
        <h1>Widget Demo</h1>\
        <div>\
            <div>test0</div>\
            @if: true {\
                <div>test1</div>\
        	}\
            @foreach: [1] {\
                <div>test2</div>\
			}\
            <div data-bind="html: a"></div>\
            <div data-bind="test: a">test binding</div>\
            @with: user {\
                <div>\
                    <input type="text" data-bind="value: firstName" />\
                </div>\
                <div>\
                    <span data-bind="html: firstName"></span>\
                    <span data-bind="html: lastName"></span>\
                </div>\
                <div data-bind="html: $parent.$data.a"></div>\
            }\
            <div data-bind="html: a"></div>\
        </div>\
    ');
    window.viewModel = {
        a: '1234',
        b: {
            c: 'abcd'
        }
    };
    Module.watchProperty(viewModel, 'user', {
        value: new User('Sean', 'Johnson')
    });
    window.builtTemplate = Template.build(template, viewModel);
    document.body.appendChild(builtTemplate);
    console.log(template);
};
