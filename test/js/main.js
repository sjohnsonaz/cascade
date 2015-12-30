window.onload = function () {
    window.user = new User('Sean', 'Johnson');

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

    window.oldArray = new Array();
    window.newArray = new ArrayModule();
    oldArray[0] = 1;
    newArray[0] = 2;
    console.log(oldArray);
    console.log(newArray);
    for (var index = 0, length = newArray.length; index < length; index++) {
        console.log(newArray[index]);
    }
};
