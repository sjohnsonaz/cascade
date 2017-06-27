import { expect } from 'chai';

import { observable, Computed } from '../scripts/modules/Cascade';
import DecoratorUtil from '../scripts/util/DecoratorUtil';

describe('DecoratorUtil', () => {
    function minLength(length: number = 0): any {
        return function (target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<boolean>): any {
            DecoratorUtil.attachObservable<boolean>(target, propertyKey + '_minLength', (value: boolean, thisArg: any) => {
                return new Computed<boolean>(function () {
                    let value = thisArg[propertyKey];
                    return (typeof value === 'string') && value.length >= length;
                }, false, thisArg);
            }, true);
        }
    }

    it('should provide secondary Decorators', () => {
        class ViewModel {
            @minLength(1) @observable value: string = 'abcd';
        }

        let viewModel = new ViewModel();
        expect(viewModel['value_minLength']).to.equal(true);
    });
});