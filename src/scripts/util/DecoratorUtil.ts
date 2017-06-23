export interface IHiddenContainerHash<T> {
    [index: string]: T;
}

export interface IHiddenContainer<T> {
    properties: IHiddenContainerHash<T>;
}

export default class DecoratorUtil {
    static attachObject<T>(obj: any, factory: (obj: any) => IHiddenContainer<T>, hiddenProperty: string = '_graph') {
        if (!obj[hiddenProperty]) {
            Object.defineProperty(obj, hiddenProperty, {
                configurable: true,
                writable: true,
                enumerable: false,
                value: factory(obj)
            });
        }
        return obj[hiddenProperty] as IHiddenContainer<T>;
    }
}