var DomDemo = (function () {
    function DomDemo(element) {
        Dom.mountRoot(element,
            Dom.createElement('h1', undefined, 'DOM'),
            Dom.createElement('div', undefined,
                Dom.createElement('a', {
                    href: 'http://www.google.com/'
                }, 'test')
            ),
            Dom.createElement('ul', undefined,
                1234,
                document.createTextNode([0, 1, 2, 3]), {
                    a: 'a',
                    toString: function () {
                        return 'I contain ' + this.a;
                    }
                },
                Dom.createElement('li', undefined, 0),
                Dom.createElement('li', undefined, 1),
                Dom.createElement('li', undefined, 2),
                Dom.createElement('li', undefined, 3),
                Dom.createElement('li', undefined, 4),
                Dom.createElement('li', undefined, 5),
                Dom.createElement('li', undefined, 6),
                Dom.createElement('li', undefined, 7),
                Dom.createElement('li', undefined, 8),
                Dom.createElement('li', undefined, 9)
            ),
            Dom.createElement('ul', undefined,
                Dom.renderForEach(['a', 'b', 'c', 'd'], function (content, data, index) {
                    return Dom.createElement('li', undefined, content);
                })
            )
        );
    }

    DomDemo.prototype = {};

    return DomDemo;
})();

window.onload = function () {
    window.application = new DomDemo(document.body);
};
