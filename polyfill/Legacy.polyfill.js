/*
 * Console-polyfill
 * https://github.com/paulmillr/console-polyfill
 * MIT license
 */
(function (con) {
    'use strict';
    var prop, method;
    var empty = {};
    var dummy = function () {};
    var properties = 'memory'.split(',');
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn').split(',');
    while (prop = properties.pop())
        con[prop] = con[prop] || empty;
    while (method = methods.pop())
        con[method] = con[method] || dummy;
})(this.console = this.console || {}); // Using `this` for web workers.

/*
 * addEventListener polyfill 1.0
 * Eirik Backer
 * MIT Licence
 */
(function (win, doc) {
    if (win.addEventListener)
        return; // No need to polyfill

    function docHijack(p) {
        var old = doc[p];
        doc[p] = function (v) {
            return addListen(old(v));
        };
    }

    function addEvent(on, fn, self) {
        return (self = this).attachEvent('on' + on, function (e) {
            e = e || win.event;
            e.preventDefault = e.preventDefault || function () {
                e.returnValue = false;
            };
            e.stopPropagation = e.stopPropagation || function () {
                e.cancelBubble = true;
            };
            fn.call(self, e);
        });
    }

    function addListen(obj, i) {
        if (i = obj.length)
            while (i--)
                obj[i].addEventListener = addEvent;
        else
            obj.addEventListener = addEvent;
        return obj;
    }

    addListen([doc, win]);
    if ('Element' in win)
        win.Element.prototype.addEventListener = addEvent; // IE8
    else { // IE < 8
        doc.attachEvent('onreadystatechange', function () {
            addListen(doc.all);
        }); // Make sure we also init at domReady
        docHijack('getElementsByTagName');
        docHijack('getElementById');
        docHijack('createElement');
        addListen(doc.all);
    }
})(window, document);

/*
 * Function.bind()
 * BuildJS
 */
if (!Function.prototype.bind) {
    (function () {
        Function.prototype.bind = function (context) {
            if (context) {
                var self = this;
                if (arguments.length > 1) {
                    var prepend = Array.prototype.slice.call(arguments, 1);
                    return function () {
                        self.apply(context, Array.prototype.slice.call(arguments).unshift(prepend));
                    };
                } else {
                    return function () {
                        self.apply(context, arguments);
                    };
                }
            } else {
                return this;
            }
        };
    })();
}

/*
 * Object.keys()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({
                toString: null
            }).propertyIsEnumerable('toString'),
            dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [],
                prop, i;

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

/*
 * Object.create()
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 */
if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if (o === null) {
                throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') {
                throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

if (typeof Object.setPrototypeOf != 'function') {
    (function () {
        var prototypeSupport = !!({}).__proto__;
        Object.setPrototypeOf = function (obj, proto) {
            if (prototypeSupport) {
                obj.__proto__ = proto;
            } else {
                for (var property in proto) {
                    // We may need to copy all, not just Object.hasOwnProperty.
                    // However, do not set if an identical property is visible.
                    if (obj[property] !== proto[property]) {
                        obj[property] = proto[property];
                    }
                }
            }
            return obj;
        };
    })();
}

/*
 * classList.js: Cross-browser full element.classList implementation. 2012-11-15
 * Eli Grey
 * http://eligrey.com
 * http://purl.eligrey.com/github/classList.js/blob/master/classList.js
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*
 * global self, document, DOMException
 */
if (typeof document !== "undefined" && !("classList" in document.documentElement)) {
    (function (view) {
        "use strict";
        if (!('HTMLElement' in view) && !('Element' in view)) {
            return;
        }
        var classListProp = "classList";
        var protoProp = "prototype";
        var elemCtrProto = (view.HTMLElement || view.Element)[protoProp];
        var objCtr = Object;
        var strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
        };
        var arrIndexOf = Array[protoProp].indexOf || function (item) {
            var i = 0,
                len = this.length;
            for (; i < len; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
        // Vendors: please allow content code to instantiate DOMExceptions
        var DOMEx = function (type, message) {
            this.name = type;
            this.code = DOMException[type];
            this.message = message;
        };
        var checkTokenAndGetIndex = function (classList, token) {
            if (token === "") {
                throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
            }
            if (/\s/.test(token)) {
                throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
            }
            return arrIndexOf.call(classList, token);
        };
        var ClassList = function (elem) {
            var trimmedClasses = strTrim.call(elem.className);
            var classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
            for (var i = 0, len = classes.length; i < len; i++) {
                this.push(classes[i]);
            }
            this._updateClassName = function () {
                elem.className = this.toString();
            };
        };
        var classListProto = ClassList[protoProp] = [];
        var classListGetter = function () {
            return new ClassList(this);
        };
        // Most DOMException implementations don't allow calling DOMException's
        // toString()
        // on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token, updated = false;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            } while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var tokens = arguments,
                i = 0,
                l = tokens.length,
                token, updated = false;
            do {
                token = tokens[i] + "";
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            } while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, forse) {
            token += "";

            var result = this.contains(token),
                method = result ? forse !== true && "remove" : forse !== false && "add";

            if (method) {
                this[method](token);
            }

            return !result;
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter,
                enumerable: true,
                configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }
    }(self));
}

/*
 * CustomEvent
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 */
if (typeof CustomEvent != 'function') {
    (function () {
        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined
            };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
}
