window.onload = function () {
    window.user = new(function User() {
        Module.watchProperty(this, 'firstName', undefined, 'Sean');
        Module.watchProperty(this, 'lastName', undefined, 'Johnson');
        Module.watchProperty(this, 'fullName');

        this.binding = new Binding(function (firstName, lastName) {
            return 'Full Name: ' + firstName + ' ' + lastName;
        }, undefined, [
            new Reference(this, 'firstName'),
            new Reference(this, 'lastName')
        ], new Reference(this, 'fullName'), false);
    })();

    window.input = document.getElementById('input');
    Module.watchProperty(input, 'val', undefined, undefined, undefined, undefined, input, undefined, 'value', function (name) {
        return input[name];
    }, function (name, value) {
        input[name] = value;
    });
    input.addEventListener('change', function() {
        input.val = input.value;
    })
    window.binding = new Binding(undefined, undefined, new Reference(user, 'firstName'), new Reference(input, 'val'), true);

    user.$module.subscribe('fullName', function (value) {
        document.getElementById('output').innerHTML = value;
    });
};
