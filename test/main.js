window.onload = function () {
    window.user = new User();

    window.input = document.getElementById('input');
    Module.watchProperty(input, 'val', {
        innerName: 'value',
        getter: function (name) {
            return input[name];
        },
        setter: function (name, value) {
            input[name] = value;
        }
    });
    input.addEventListener('change', function () {
        input.val = input.value;
    });
    window.binding = Module.bind('sync', user.$module.references.firstName, input.$module.references.val);

    user.$module.subscribe('fullName', function (value) {
        document.getElementById('output').innerHTML = value;
    });
};
