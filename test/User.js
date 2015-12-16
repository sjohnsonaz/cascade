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
            this.$module.references.firstName,
            this.$module.references.lastName
        ], this.$module.references.fullName, false);
    }

    User.prototype = {

    };

    return User;
})();
