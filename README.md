# Build Cascade

[![Build Status](https://travis-ci.org/sjohnsonaz/build-cascade.svg?branch=master)](https://travis-ci.org/sjohnsonaz/build-cascade)

A JavaScript/TypeScript library for creating modern user interfaces. It combines Reactive ViewModels with Functional DOM Components to create seamless flow of data.

## Reactive ViewModels

Cascade builds ViewModels with reactive properties to synchronize data. Properties may be marked as observable, so that changes may be watched, or computed, which then watch for changes in related observables. With this, a dynamic tree of data may be built, all which is updated automatically.

Furthermore, any Functional DOM Component which references an observable or computed, will be updated automatically.

```
class User {
    @observable firstName: string = '';
    @observable lastName: string = '';
    @observable get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
    @array list = [1, 2, 3, 4];
}
```

## Functional DOM Components

Cascade uses either JSX or direct JavaScript calls to create a Virtual Dom. These Virtual Nodes can then be rendered into DOM Nodes for display.

```
Cascade.createElement<T extends Object>(
    type: string | Component,
    properties: T,
    ...children: Array<IVirtualNode<any> | string>
): IVirtualNode<any>;
```

Components may be defined by simply extending the Component class.

```
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

Components can then be rendered by either calling

```
Cascade.createElement(UserView, { user: User });
```

or with JSX by calling

```
<UserView user={User} />
```

## Rendering

Cascade will render directly to any DOM node specified. Simply call

```
Cascade.render(
    node: HTMLElement | string,
    virtualNode: IVirtualNode<any>,
    callback?: (n: Node) => any
): void;
```

For example

```
Cascade.render(
    document.getElementById('root'),
    <UserView user={User} />
);
```
