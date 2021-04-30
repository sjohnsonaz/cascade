import { observable } from '../cascade/Decorators';

class ViewModel {
    runsB = 0;
    runsC = 0;
    runsD = 0;
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
}

describe('Graph.pull', function () {
    it('should pull changes to multiple layers - lower first', function () {
        var model: any = new ViewModel();
        model.a = 11;
        var b = model.b;
        var c = model.c;
        expect(b).toBe(11);
        expect(c).toBe(11);
        expect(model.runsB).toBe(1);
        expect(model.runsC).toBe(1);
        expect(model.runsD).toBe(0);
    });

    it('should pull changes to multiple layers - higher first', function () {
        var model: any = new ViewModel();
        model.a = 11;
        var c = model.c;
        var b = model.b;
        expect(b).toBe(11);
        expect(c).toBe(11);
        expect(model.runsB).toBe(1);
        expect(model.runsC).toBe(1);
        expect(model.runsD).toBe(0);
    });
});
