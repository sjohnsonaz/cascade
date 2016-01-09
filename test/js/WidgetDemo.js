window.onload = function () {
    window.template = Template.parse('\
        <h1>Widget Demo</h1>\
        <div>\
            <div>Regular text</div>\
            @if: false {\
                <div>boolean constant</div>\
        	}\
            @if: user {\
                <div>boolean variable</div>\
        	}\
            <ul>\
                <li>Static row</li>\
                @foreach: array {\
                <li>\
                    <span data-bind="html: firstName"></span>\
                    <span data-bind="html: lastName"></span>\
                </li>\
			    }\
            </ul>\
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
        },
    };
    Module.watchProperty(viewModel, 'array', {
        value: [
            new User('A', 'A'),
            new User('B', 'B'),
            new User('C', 'C'),
            new User('D', 'D')
        ],
        array: true
    });
    Module.watchProperty(viewModel, 'user', {
        value: new User('Sean', 'Johnson')
    });
    window.builtTemplate = Template.build(template, viewModel);
    document.body.appendChild(builtTemplate);
    console.log(template);
};
