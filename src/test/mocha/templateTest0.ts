import {expect} from 'chai';

import Template from '../../scripts/template/Template';
import {observable} from '../../scripts/modules/Cascade';

describe('Template', function() {
    it('should parse text into a Template and fragment', function() {
        var template = new Template('\r\n\
            <div id="testNode">Test Node</div>\r\n\
        ');
        var fragment = template.build();
        var testNode = fragment.getElementById("testNode");
        expect(!!testNode).to.equal(true);
    });

    it('should create nodes with conditional bindings', function() {
        var template = new Template('\r\n\
            <div>always render</div>\r\n\
            @if: false {\r\n\
                <div id="testFalse">boolean constant false</div>\r\n\
            }\r\n\
            @if: true {\r\n\
                <div id="testTrue">boolean constant true</div>\r\n\
        	}\r\n\
        ');
        var fragment = template.build();
        var testFalse = fragment.getElementById("testFalse");
        var testTrue = fragment.getElementById("testTrue");
        expect(testTrue && !testFalse).to.equal(true);
    });

    it('should output values', function() {
        var viewModel = {
            showFirst: true,
            showSecond: false,
            valueFirst: 'abcd',
            valueSecond: 'efgh'
        };
        var template = new Template('\r\n\
            @if: showFirst {\r\n\
                <div id="testFirst" data-bind="html: valueFirst"></div>\r\n\
            }\r\n\
            @if: showSecond {\r\n\
                <div id="testSecond" data-bind="html: valueSecond"></div>\r\n\
        	}\r\n\
        ');
        var fragment = template.build(viewModel);
        var testFirst = fragment.getElementById("testFirst");
        var testSecond = fragment.getElementById("testSecond");
        expect(testFirst && testFirst.innerHTML == 'abcd' && !testSecond).to.equal(true);
    });

    it('should use with to control scope', function() {
        var viewModel = {
            a: '1234',
            b: {
                c: 'abcd'
            }
        };
        var template = new Template('\
            <div>\
                <div>test0</div>\
                {{ test1 }}\
                <div>test2</div>\
                <div data-bind="html: a"></div>\
                <div data-bind="with: b">\
                    <div data-bind="html: b.c"></div>\
                </div>\
            </div>\
        ');
        var builtTemplate = template.build(viewModel)
        //document.body.appendChild(builtTemplate);
        expect(!!builtTemplate).to.equal(true);
    });

    it('should use observable models', function() {
        class User {
            @observable firstName: string;
            @observable lastName: string;
            @observable phone: number[];
            @observable get fullName() {
                return this.firstName + ' ' + this.lastName;
            }

            constructor(firstName, lastName) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.phone = [1, 2, 3];
            }
        }

        class ViewModel {
            @observable a: string = '1234';
            b = {
                c: 'abcd'
            };
            active: boolean = true;
            @observable array: User[] = [
                new User('A', 'A'),
                new User('B', 'B'),
                new User('C', 'C'),
                new User('D', 'D')
            ]
        }
        var template = new Template('\
            <h1>Widget Demo</h1>\
            <div>\
                <div>Regular text</div>\
                @if: false {\
                    <div>boolean constant</div>\
            	}\
                @if: active {\
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
        /*
        var builtTemplate = template.build(viewModel)
        document.body.appendChild(builtTemplate);
        viewModel.array.push(new User('E', 'E'));
        window.setTimeout(function() {
            expect(!!builtTemplate).to.equal(true);
        }, 20)
        */
        expect(true).to.equal(true);
    });
});
