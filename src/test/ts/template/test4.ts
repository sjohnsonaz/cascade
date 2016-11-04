import TestRunner from '../TestRunner';
import Template from '../../../scripts/template/Template';
import {observable} from '../../../scripts/modules/Cascade';

import User from './User';

class ViewModel {
    @observable a: string = '1234';
    b = {
        c: 'abcd'
    };
    @observable array: User[] = [
        new User('A', 'A'),
        new User('B', 'B'),
        new User('C', 'C'),
        new User('D', 'D')
    ]
}

TestRunner.test({
    name: 'Values can be used in a Template.',
    test: function(input, callback) {
        var template = new Template('\
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
        var viewModel = new ViewModel();
        var builtTemplate = template.build(viewModel)
        document.body.appendChild(builtTemplate);
        viewModel.array.push(new User('E', 'E'));
        window.setTimeout(function() {
            callback(builtTemplate);
        }, 20)
    },
    assert: function(result, callback) {
        callback(true);
    }
});
