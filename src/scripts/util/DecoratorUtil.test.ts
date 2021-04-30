import { observable } from '../cascade/Decorators';
import Computed from '../graph/Computed';

import DecoratorUtil from './DecoratorUtil';

describe('DecoratorUtil', () => {
    function minLength(length: number = 0): any {
        return function (
            target: any,
            propertyKey: string,
            descriptor?: TypedPropertyDescriptor<boolean>,
        ): any {
            DecoratorUtil.attachObservable<boolean>(
                target,
                propertyKey + '_minLength',
                (value: boolean, thisArg: any) => {
                    return new Computed<boolean>(
                        function () {
                            let value = thisArg[propertyKey];
                            return typeof value === 'string' && value.length >= length;
                        },
                        false,
                        thisArg,
                    );
                },
                true,
            );
        };
    }

    it('should provide secondary Decorators', () => {
        class ViewModel {
            @minLength(1) @observable value: string = 'abcd';
        }

        let viewModel = new ViewModel();
        expect(viewModel['value_minLength']).toBe(true);
    });
});
