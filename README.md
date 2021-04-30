# Cascade

![](https://github.com/sjohnsonaz/cascade/workflows/Node%20CI/badge.svg) [![npm version](https://badge.fury.io/js/cascade.svg)](https://badge.fury.io/js/cascade)

A JavaScript/TypeScript library for creating modern user interfaces. It combines Reactive ViewModels with Functional DOM Components to create seamless flow of data.

## Reactive ViewModels

Cascade builds ViewModels with reactive properties to synchronize data. Properties may be marked as observable, so that changes may be watched, or computed, which then watch for changes in related observables. With this, a dynamic tree of data may be built, all which is updated automatically.

Furthermore, any Functional DOM Component which references an observable or computed, will be updated automatically.

### TypeScript decorators

Simply use the `@observable` decorator, which will automatically detect if the property is a value, an array, or a getter function.  Computed values must be declared as a getter, and arrays must be declared with their types.  Observable hashes may be created with `@hash`.  

> **Note:** Decorators depend on TypeScript. You must set `"experimentalDecorators": true` in your `tsconfig.json` file.

```typescript
class User {
    @observable firstName: string = '';
    @observable lastName: string = '';
    @observable get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
    @observable list: number[] = [1, 2, 3, 4];
    @array array: number[] = [5, 6, 7, 8];
    @hash hash: {} = {
        'property': 'value'
    };
}
```

> **Note:** Type detection for arrays depends on the optional package `reflect-metadata`. You must also set `"emitDecoratorMetadata": true` in your `tsconfig.json` file. For IE10 and below, you must also include `es6-shim` or similar polyfills.  If you don't wish to install polyfills, then you must use `@array` instead of `@observable`.

### JavaScript usage

You may also create observable properties directly.

```typescript
Cascade.createObservable<T>(obj: any, property: string, value?: T);

Cascade.createObservableArray<T>(obj: any, property: string, value?: Array<T>);

Cascade.createObservableHash<T>(obj: any, property: string, value?: IHash<T>);

Cascade.createComputed<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean, setter?: (n: T) => any);
```

You may also create the observables as objects. Keep in mind, these are accessed as methods instead of direct usage.

```typescript
Observable<T>(value?: T);

ObservableArray<T>(value?: Array<T>);

ObservableHash<T>(value?: IHash<T>);

Computed<T>(definition: (n?: T) => T, defer: boolean = false, thisArg?: any, setter?: (n: T) => any);
```

> **Note:** Internet Explorer does not support `ObservableHash`.  It also requires `ObservableArray` values to be modified by function calls instead of setters.
> 
> In modern browsers which support `Proxy` objects, we can simply modify indexed values with:
> 
> `viewModel.list[4] = 5;`
> 
> However, in Internet Explorer, we would need to write:
> 
> `viewModel.list.set(4, 5);`

## Functional DOM Components

Cascade uses either JSX or direct JavaScript calls to create a Virtual Dom. These Virtual Nodes can then be rendered into DOM Nodes for display.

```typescript
Cascade.createElement<T extends Object>(
    type: string | Component,
    props: T,
    ...children: Array<any>
): IVirtualNode<any>;
```

Components may be defined by simply extending the Component class. Any property which references an observable will cause the Component to render any time the observable updates.

```typescript
interface IUserViewProps {
    user: User;
}

class UserView extends Component<IUserViewProps> {
    render() {
        return (
            <div>{this.props.user.fullName}</div>
        );
    }
}
```

### Using Components

Components can then be rendered by either calling

```typescript
Cascade.createElement(UserView, { user: User });
```

or with JSX by calling

```typescript
<UserView user={User} />
```

> **Note** Using JSX requires the options `"jsx": "react"` and `"reactNamespace": "Cascade"` in your `tsconfig.json` file. `Cascade` must also be imported into any `.jsx` or `.tsx` file.

### Component and VirtualNode Properties

Components and VirtualNodes have optional props

`key: string`

Specifying a `key` for a Component or VirtualNode will improve rendering speeds in certain cases. This is a string, which should be unique to that node within its parent. It is most useful for a set of children which change often, such as arrays or conditional children.

`ref: (n: Node) => void`

A `ref` callback will receive the resulting `Node` whenever the Component or VirtualNode is rendered for the first time. This is useful for directly modifying the `Node` after rendering.

## Rendering

Cascade will render directly to any DOM node specified. Simply call

```typescript
Cascade.render(
    node: HTMLElement | string,
    virtualNode: IVirtualNode<any>
): void;
```

For example

```typescript
Cascade.render(
    document.getElementById('root'),
    <UserView user={User} />
);
```

## Troubleshooting and Optimization

### Computed Subscriptions

Computed properties subscribe to observables simply by reading them.  So any property that is read, will generate a subscription.  If you don't want to subscribe, use `Cascade.peek(obj: any, property: string)` to read the value without subscribing.

Also, if you need to call methods inside of a computed, those methods may read from observables as well.  This behavior may or may not be what you intend.  To protect against this, use `Cascade.wrapContext(callback: () => any, thisArg?: any)`, which will capture any generated subscriptions without actually subscribing to them.

### Component Subscriptions

Components manage their subscriptions through the `Component.root` computed property.  Internally, this calls the `Component.render` method, so any observable read while rendering will generate a subscription.  In order to reduce re-renders, read observable properites as late as possible.  Meaning, it's better to read inside a child component, than inside a parent and then pass the value into the child.  This way only the child re-renders when the value is updated.

### Multiple Installations

If a Component or Computed is not correctly updating, there may be more than one copy of Cascade referenced.  There must be exactly one copy for subscriptions to be tracked correctly.
