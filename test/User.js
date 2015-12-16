var User = (function () {
    function User() {
        Module.watchProperties(this, {
            firstName: {
                value: 'Sean'
            },
            lastName: {
                value: 'Johnson'
            },
            fullName: {}
        });

        this.binding = new Binding(function (firstName, lastName) {
            return 'Full Name: ' + firstName + ' ' + lastName;
        }, undefined, [
            new Reference(this, 'firstName'),
            new Reference(this, 'lastName')
        ], new Reference(this, 'fullName'), false);
    }

    User.prototype = {

    };

    return User;
})();
