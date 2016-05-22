var Define = (function () {
    function Define() {

    }

    Define.prototype = {

    };

    Define.extend = function ($constructor, $parent, $prototype) {
        return $constructor.prototype = Object.assign(Object.create($parent.prototype, {
            constructor: {
                value: $constructor,
                writable: true,
                configurable: true
            }
        }), $prototype);
    };

    Define.super = function ($constructor, thisArg) {
        $constructor.apply(thisArg, []);//Array.prototype.splice.call(arguments, 0, 2));
    };

    Define.superConstructor = function (thisArg) {
        arguments.callee.caller.prototype.constructor.apply(thisArg, Array.prototype.splice.call(arguments, 0, 1));
    };

    return Define;
})();
