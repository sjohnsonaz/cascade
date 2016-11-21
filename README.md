# Cascade

[![Build Status](https://travis-ci.org/sjohnsonaz/cascade.svg?branch=master)](https://travis-ci.org/sjohnsonaz/cascade)

A JavaScript/TypeScript library for creating modern user interfaces. It combines Reactive ViewModels with Functional DOM Components to create seamless flow of data.

## Reactive ViewModels

Cascade builds ViewModels with reactive properties to synchronize data. Properties may be marked as observable, so that changes may be watched, or computed, which then watch for changes in related observables. With this, a dynamic tree of data may be built, all which is updated automatically.

Furthermore, any Functional DOM Component which references an observable or computed, will be updated automatically.

### TypeScript decorators

Simply use the `@observable` decorator, which will automatically detect if the property is a value, an array, or a getter function. Computed values must be declared as a getter, and arrays must be declared with their types.

> **Note:** Decorators depend on TypeScript. You must set `experimentalDecorators: true` in your `tsconfig.json` file.

```typescript
class User {
    @observable firstName: string = '';
    @observable lastName: string = '';
    @observable get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
    @observable list: number[] = [1, 2, 3, 4];
}
```

> **Note:** Type detection for arrays depends on the optional package `reflect-metadata`. You must also set `"emitDecoratorMetadata: true` in your `tsconfig.json` file. For IE10 and below, you must also include `es6-shim` or similar polyfills. If you don't wish to install polyfills, then you must use `@array` instead of `@observable`.

### JavaScript usage

You may also create observable properties directly.

```typescript
Cascade.createObservable<T>(obj: any, property: string, value: T);

Cascade.createObservableArray<T>(obj: any, property: string, value: Array<T>);

Cascade.createComputed<T>(obj: any, property: string, definition: (n?: T) => T, defer?: boolean);
```

You may also create the observables as objects. Keep in mind, these are accessed as methods instead of direct usage.

```typescript
Observable<T>(value: T);

ObservableArray<T>(value: Array<T>);

Computed<T>(definition: (n: T) => T, defer: boolean = false, thisArg?: any);
```

## Functional DOM Components

Cascade uses either JSX or direct JavaScript calls to create a Virtual Dom. These Virtual Nodes can then be rendered into DOM Nodes for display.

```typescript
Cascade.createElement<T extends Object>(
    type: string | Component,
    properties: T,
    ...children: Array<IVirtualNode<any> | string>
): IVirtualNode<any>;
```

Components may be defined by simply extending the Component class. Any property which references an observable will cause the Component to render any time the observable updates.

```typescript
interface IUserViewProperties {
    user: User;
}

class UserView extends Component<IUserViewProperties> {
    render() {
        return (
            <div>{this.properties.user.fullName}</div>
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

### Component and VirtualNode Properties

Components and VirtualNodes have optional properties

`key: string`

Specifying a `key` for a Component or VirtualNode will improve rendering speeds in certain cases. This is a string, which should be unique to that node within its parent. It is most useful for a set of children which change often, such as arrays or conditional children.

`ref: (n: Node) => void`

A `ref` callback will receive the resulting `Node` whenever the Component or VirtualNode is rendered for the first time. This is useful for directly modifying the `Node` after rendering.

## Rendering

Cascade will render directly to any DOM node specified. Simply call

```typescript
Cascade.render(
    node: HTMLElement | string,
    virtualNode: IVirtualNode<any>,
    callback?: (n: Node) => any
): void;
```

For example

```typescript
Cascade.render(
    document.getElementById('root'),
    <UserView user={User} />
);
```
