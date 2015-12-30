var User = (function () {
    function User() {
        Module.watchProperties(this, {
            firstName: {
                value: 'Sean'
            },
            lastName: {
                value: 'Johnson'
            },
            fullName: {},
            phone: {
                array: true,
                value: [1, 2, 3]
            }
        });

        this.binding = Module.bind('username', [
            this.$module.references.firstName,
            this.$module.references.lastName
        ], this.$module.references.fullName);
    }

    User.prototype = {

    };

    return User;
})();

Module.handlers['username'] = {
    update: function (firstName, lastName) {
        return 'Full Name: ' + firstName + ' ' + lastName;
    }
};
