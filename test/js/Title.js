var Title = (function() {
    function Title() {
        Component.call(this);
    }

    Title.prototype = Object.create(Component.prototype, {
        constructor: {
            value: Title
        },
        elementType: {
            value: 'h1'
        },
        render: {
            value: function(dom, element, data) {
            }
        }
    });

    return Title;
})();
