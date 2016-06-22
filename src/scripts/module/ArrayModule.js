 var ArrayModule = (function () {
     /**
      * @class build.utility.ArrayModule
      */
     function ArrayModule(base) {
         var inner = (base instanceof Array && arguments.length == 1) ? base : Array.apply({}, arguments);
         Object.setPrototypeOf(inner, ArrayModule.prototype);
         Object.defineProper
         inner.buffering = false;
         return inner;
     }

     ArrayModule.prototype = Object.create(Array.prototype, {
         constructor: {
             value: ArrayModule,
             writable: true,
             configurable: true
         }
     });

     /**
      * @method push
      * Array.prototype.push([item1[, item2[, ...]]])
      * Adds one or more elements to the end of an array and returns the new length of the array.
      * @returns
      */
     ArrayModule.prototype.push = function () {
         var offset = this.length;
         var output = Array.prototype.push.apply(this, arguments);
         var insertActions = [];
         for (var index = 0, length = arguments.length; index < length; index++) {
             insertActions[index + offset] = arguments[index];
         }
         this.publish('insert', insertActions);
         return output;
     };

     /**
      * @method pop
      * Array.prototype.pop()
      * Removes the last element from an array and returns that element.
      * @returns
      */
     ArrayModule.prototype.pop = function () {
         var length = this.length;
         var item = this[length - 1];
         var output = Array.prototype.pop.apply(this, arguments);
         var deleteActions = [];
         deleteActions[length - 1] = item;
         this.publish('delete', undefined, deleteActions);
         return output;
     };

     /**
      * @method unshift
      * Array.prototype.unshift([item1[, item2[, ...]]])
      * Adds one or more elements to the front of an array and returns the new length of the array.
      * @returns
      */
     ArrayModule.prototype.unshift = function () {
         var output = Array.prototype.unshift.apply(this, arguments);
         var insertActions = [];
         for (var index = 0, length = arguments.length; index < length; index++) {
             insertActions[index] = arguments[index];
         }
         this.publish('insert', insertActions);
         return output;
     };

     /**
      * @method shift
      * Array.prototype.shift()
      * Removes the first element from an array and returns that element.
      * @returns
      */
     ArrayModule.prototype.shift = function () {
         var item = this[0];
         var output = Array.prototype.shift.apply(this, arguments);
         var deleteActions = [];
         deleteActions[0] = item;
         this.publish('delete', undefined, deleteActions);
         return output;
     };

     /**
      * @method reverse
      * Array.prototype.reverse()
      * Reverses the order of the elements of an array -- the first becomes the last, and the last becomes the first.
      * @returns
      */
     ArrayModule.prototype.reverse = function () {
         var output = Array.prototype.reverse.apply(this, arguments);
         this.publish('reorder');
         return output;
     };

     /**
      * @method sort
      * Array.prototype.sort()
      * Sorts the elements of an array in place and returns the array.
      * @returns
      */
     ArrayModule.prototype.sort = function () {
         var output = Array.prototype.sort.apply(this, arguments);
         this.publish('reorder');
         return output;
     };

     /**
      * @method splice
      * Array.prototype.splice(start, deleteCount[, item1[, item2[, ...]]])
      * Adds and/or removes elements from an array.
      * @returns
      */
     ArrayModule.prototype.splice = function (start, deleteCount) {
         var items = Array.prototype.splice.call(arguments, 2);
         var deleteActions = [];
         for (var index = 0, length = deleteCount; index < length; index++) {
             deleteActions[start + index] = this[start + index];
         }
         var insertActions = [];
         for (var index = 0, length = items.length; index < length; index++) {
             insertActions[start + index] = items[index];
         }
         var output = Array.prototype.splice.apply(this, arguments);
         this.publish('deleteandinsert', insertActions, deleteActions);
         return output;
     };

     //+ Array.prototype.fill()
     //Fills all the elements of an array from a start index to an end index with a static value.

     ArrayModule.prototype.removeAll = function () {
         this.length = 0;
         this.publish('clear');
     };

     ArrayModule.prototype.get = function (index) {
         return this[index];
     };

     ArrayModule.prototype.set = function (index, value) {
         this[index] = value;
         var insertActions = [];
         var deleteActions = [];
         insertActions[index] = value;
         deleteActions[index] = this[index];
         this.publish('deleteandinsert', insertActions, deleteActions);
     };

     ArrayModule.prototype.remove = function (value) {
         // This will publish as a splice.
         var index = this.indexOf(value);
         if (index != -1) {
             return this.splice(index, 1);
         } else {
             return [];
         }
     };

     ArrayModule.prototype.pushUnique = function (value) {
         // This will publish as a push.
         var index = this.indexOf(value);
         if (index == -1) {
             this.push(value);
         }
     };

     ArrayModule.prototype.subscribe = function (subscriber) {
         switch (typeof subscriber) {
             case 'object':
             case 'function':
                 this.subscribers = this.subscribers || [];
                 this.subscribers.push(subscriber);
                 break;
         }
     };

     ArrayModule.prototype.unsubscribe = function (subscriber) {
         switch (typeof subscriber) {
             case 'object':
             case 'function':
                 this.subscribers = this.subscribers || [];
                 var index = this.subscribers.indexOf(subscriber);
                 if (index != -1) {
                     this.subscribers.splice(index, 1);
                 }
                 break;
         }
     };

     ArrayModule.prototype.publish = function (action, insertActions, deleteActions) {
         if (this.subscribers) {
             for (var index = 0, length = this.subscribers.length; index < length; index++) {
                 var subscriber = this.subscribers[index];
                 switch (typeof subscriber) {
                     case 'function':
                         subscriber(action, insertActions, deleteActions);
                         break;
                     case 'object':
                         subscriber.run(name, arguments);
                         break;
                 }
             }
         }
     };

     ArrayModule.prototype.publishAll = function () {
         this.publish('all');
     };

     // Accessor methods
     // These methods do not modify the array and return some representation of the array.
     // Array.prototype.concat()
     // Returns a new array comprised of this array joined with other array(s) and/or value(s).
     // Array.prototype.join()
     // Joins all elements of an array into a string.
     // Array.prototype.slice()
     // Extracts a section of an array and returns a new array.
     // Array.prototype.toSource()
     // Returns an array literal representing the specified array; you can use this value to create a new array. Overrides the Object.prototype.toSource() method.
     // Array.prototype.toString()
     // Returns a string representing the array and its elements. Overrides the Object.prototype.toString() method.
     // Array.prototype.toLocaleString()
     // Returns a localized string representing the array and its elements. Overrides the Object.prototype.toLocaleString() method.
     // Array.prototype.indexOf()
     // Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
     // Array.prototype.lastIndexOf()
     // Returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found.

     // Iteration methods
     // Several methods take as arguments functions to be called back while processing the array. When these methods are called, the length of the array is sampled, and any element added beyond this length from within the callback is not visited. Other changes to the array (setting the value of or deleting an element) may affect the results of the operation if the method visits the changed element afterwards. While the specific behavior of these methods in such cases is well-defined, you should not rely upon it so as not to confuse others who might read your code. If you must mutate the array, copy into a new array instead.
     // Array.prototype.forEach()
     // Calls a function for each element in the array.
     // Array.prototype.entries()
     // Returns a new Array Iterator object that contains the key/value pairs for each index in the array.
     // Array.prototype.every()
     // Returns true if every element in this array satisfies the provided testing function.
     // Array.prototype.some()
     // Returns true if at least one element in this array satisfies the provided testing function.
     // Array.prototype.filter()
     // Creates a new array with all of the elements of this array for which the provided filtering function returns true.
     // Array.prototype.find()
     // Returns the found value in the array, if an element in the array satisfies the provided testing function or undefined if not found.
     // Array.prototype.findIndex()
     // Returns the found index in the array, if an element in the array satisfies the provided testing function or -1 if not found.
     // Array.prototype.keys()
     // Returns a new Array Iterator that contains the keys for each index in the array.
     // Array.prototype.map()
     // Creates a new array with the results of calling a provided function on every element in this array.
     // Array.prototype.reduce()
     // Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
     // Array.prototype.reduceRight()
     // Apply a function against an accumulator and each value of the array (from right-to-left) as to reduce it to a single value.

     return ArrayModule;
 })();
