# ArrayModule

## Methods

### Mutator methods

#### Insert Methods

* `Array.prototype.push()`
Adds one or more elements to the end of an array and returns the new length of the array.<br />
**Insert**
* `Array.prototype.unshift()`<br />
Adds one or more elements to the front of an array and returns the new length of the array.<br />
**Insert**
* `Array.prototype.copyWithin(target, start[, end = this.length])`<br />
Copies a sequence of array elements within the array.<br />
**Insert**
* `Array.prototype.fill()`< br/>
Fills all the elements of an array from a start index to an end index with a static value.<br />
**insert**
* `ArrayModule.prototype.pushUnique(value)`<br />
Adds one or more elements if they do not exist in the array.<br />
**Insert**
* `ArrayModule.prototype.set(index, value)`<br />
Sets the element at the specified index.<br />
**Insert**

#### Delete Methods

* `Array.prototype.pop()`<br />
Removes the last element from an array and returns that element.<br />
**Delete**
* `Array.prototype.shift()`<br />
Removes the first element from an array and returns that element.<br />
**Delete**
* `ArrayModule.prototype.remove()`<br />
Removes the element from the array if it exists.<br />
**Delete**
* `ArrayModule.prototype.removeAll()`<br />
Removes all elements from the array.<br />
**Delete**

#### Insert and Delete Methods

* `Array.prototype.splice()`<br />
Adds and/or removes elements from an array.<br />
**Delete then Insert**

#### Reorder Methods

* `Array.prototype.reverse()`<br />
Reverses the order of the elements of an array in place — the first becomes the last, and the last becomes the first.<br />
**Reorder**
* `Array.prototype.sort()`<br />
Sorts the elements of an array in place and returns the array.<br />
**Reorder**

### Accessor methods

* `ArrayModule.prototype.get(index)`<br />
Gets the element at the specified index.<br />
