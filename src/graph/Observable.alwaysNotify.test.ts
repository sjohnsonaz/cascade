import Cascade from '../cascade/Cascade';
import { array, hash, observable } from '../cascade/Decorators';
import { IHash } from './IObservable';

describe('Observable.alwaysNotify', () => {
    class State {
        @observable value: number = 0;
        @hash hash: IHash<number>;
        @array array: number[];
    }

    it('should notify for Observable', async () => {
        let state = new State();
        let values = [];
        Cascade.setAlwaysNotify(state, 'value', true);
        Cascade.subscribe(state, 'value', (value) => {
            values.push(value);
        });
        state.value = 1;
        await Cascade.track(state, 'value');
        state.value = 1;
        await Cascade.track(state, 'value');

        expect(values.length).toBe(3);
        expect(values[0]).toBe(0);
        expect(values[1]).toBe(1);
        expect(values[2]).toBe(1);
    });

    it('should notify for ObservableArray', async () => {
        let state = new State();
        let arrays = [];
        Cascade.setAlwaysNotify(state, 'array', true);
        Cascade.subscribe(state, 'array', (value) => {
            arrays.push(value);
        });

        let array = [1];

        state.array = array;
        await Cascade.track(state, 'array');
        state.array = array;
        await Cascade.track(state, 'array');

        expect(arrays.length).toBe(3);
        expect(arrays[0].length).toBe(0);
        expect(arrays[1][0]).toBe(1);
        expect(arrays[2][0]).toBe(1);
    });

    it('should notify for ObservableHash', async () => {
        let state = new State();
        let values = [];
        Cascade.setAlwaysNotify(state, 'hash', true);
        Cascade.subscribe(state, 'hash', (value) => {
            values.push(value['test']);
        });

        let hash = { test: 1 };

        state.hash = hash;
        await Cascade.track(state, 'hash');
        state.hash = hash;
        await Cascade.track(state, 'hash');

        expect(values.length).toBe(3);
        expect(values[0]).toBe(undefined);
        expect(values[1]).toBe(1);
        expect(values[2]).toBe(1);
    });
});
