import { observable } from '../cascade/Decorators';

class ViewModel {
    runsB = 0;
    runsC = 0;
    runsD = 0;
    runsE = 0;
    @observable a = 1;
    @observable get b() {
        this.runsB++;
        return this.a;
    }
    @observable get c() {
        this.runsC++;
        return this.b;
    }
    @observable get d() {
        this.runsD++;
        return this.c;
    }
    @observable get e() {
        this.runsE++;
        return this.d;
    }
}

describe('Graph.pull', function () {
    it('should pull changes to deep layers', function () {
        var model: any = new ViewModel();
        model._graph.subscribe('e', function (value: number) {
            if (result) {
                result.finalE = value;
                result.finalRunsE = model.runsE;

                expect(result.a).toBe(11);
                expect(result.b).toBe(11);
                expect(result.c).toBe(11);
                expect(result.d).toBe(11);
                expect(result.e).toBe(1);
                expect(result.finalE).toBe(11);
                expect(result.runsB).toBe(2);
                expect(result.runsC).toBe(2);
                expect(result.runsD).toBe(2);
                expect(result.runsE).toBe(1);
                expect(result.finalRunsE).toBe(2);
            }
        });
        model.a = 11;
        var d = model.d;
        var result: any = {
            a: model._graph.observables.a.value,
            b: model._graph.observables.b.value,
            c: model._graph.observables.c.value,
            d: d,
            e: model._graph.observables.e.value,
            runsB: model.runsB,
            runsC: model.runsC,
            runsD: model.runsD,
            runsE: model.runsE,
        };
    });
});
