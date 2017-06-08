# ObservableArray
`ObservableArray` extends from `Array`.  However, as `Array` is not directly extensible, some things are not completely available.  Direct modification of values via the `array[index]` method will not produce publish events.  Thus, only Mutator methods will work, and have been modified.  We have also added a `set` method.  Accessor methods are unmodified, but a `get` method has been added to match the `set` method.

## Publish events

```javascript
function (inserts[, deletes[, moves, [, callback]]])
```

- `actions` An array of action objects.
- `callback` A function called after all actions are processed

Each action is an object

### Insert
### Delete
### Insert and Delete
### Reorder
## Methods
### Mutator methods
These methods change the array values.  They will all generate publish events.

#### Insert Methods
- `Array.prototype.push()`  
- Adds one or more elements to the end of an array and returns the new length of the array.  
- **Insert**
- `Array.prototype.unshift()`  
- Adds one or more elements to the front of an array and returns the new length of the array.  
- **Insert**
- `Array.prototype.copyWithin(target, start[, end = this.length])`  
- Copies a sequence of array elements within the array.  
- **Insert**
- `Array.prototype.fill()`  
- Fills all the elements of an array from a start index to an end index with a static value.  
- **insert**
- `ObservableArray.prototype.pushUnique(value)`  
- Adds one or more elements if they do not exist in the array.  
- **Insert**
- `ObservableArray.prototype.set(index, value)`  
- Sets the element at the specified index.  
- **Insert**

#### Delete Methods
- `Array.prototype.pop()`  
- Removes the last element from an array and returns that element.  
- **Delete**
- `Array.prototype.shift()`  
- Removes the first element from an array and returns that element.  
- **Delete**
- `ObservableArray.prototype.remove()`  
- Removes the element from the array if it exists.  
- **Delete**
- `ObservableArray.prototype.removeAll()`  
- Removes all elements from the array.  
- **Delete**

#### Insert and Delete Methods
- `Array.prototype.splice()`  
- Adds and/or removes elements from an array.  
- **Delete then Insert**

#### Reorder Methods
- `Array.prototype.reverse()`  
- Reverses the order of the elements of an array in place -- the first becomes the last, and the last becomes the first.  
- **Reorder**
- `Array.prototype.sort()`  
- Sorts the elements of an array in place and returns the array.  
- **Reorder**

### Accessor methods
- `ObservableArray.prototype.get(index)`  
- Gets the element at the specified index.
