import { expect } from 'chai';

import Cascade, { observable } from '../scripts/modules/Cascade';

describe('Cascade.subscribe', () => {
    it('should call a function on change', (done) => {
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
        window.setTimeout(() => {
            expect(run).to.equal(2);
            expect(finalValue).to.equal(10);
            done();
        }, 20);
    });

    it.skip('should not call a function when value has not changed', (done) => {
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
        window.setTimeout(() => {
            expect(run).to.equal(1);
            expect(finalValue).to.equal(0);
            done();
        }, 20);
    });

    it.skip('should return a disposer function', () => {

    });
});