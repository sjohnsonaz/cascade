import { expect } from 'chai';

import Cascade, { observable } from '../scripts/modules/Cascade';

import { wait } from '../scripts/util/PromiseUtil';

describe('Cascade.subscribe', () => {
    it('should call a function on change', async () => {
        class State {
            @observable value = 1;
        }
        let state = new State();
        let run = 0;
        let finalValue = undefined;
        Cascade.subscribe(state, 'value', (value) => {
            run++;
            finalValue = value;
        });
        state.value = 10;

        await wait(20);

        expect(run).to.equal(2);
        expect(finalValue).to.equal(10);
    });

    it.skip('should not call a function when value has not changed', async () => {
        class State {
            @observable value = 1;
        }
        let state = new State();
        let run = 0;
        let finalValue = undefined;
        Cascade.subscribe(state, 'value', (value) => {
            run++;
            finalValue = value;
        });
        state.value = 0;

        await wait(20);

        expect(run).to.equal(1);
        expect(finalValue).to.equal(0);
    });

    it.skip('should return a disposer function', () => {

    });
});