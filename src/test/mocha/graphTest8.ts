import {expect} from 'chai';

import {observable} from '../../scripts/modules/Cascade';

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

describe('Graph.pull', function() {
    it('should pull changes to multiple layers - lower first', function() {
        var model: any = new ViewModel();
        model.a = 11;
        var b = model.b;
        var c = model.c;
        expect(b).to.equal(11);
        expect(c).to.equal(11);
        expect(model.runsB).to.equal(1);
        expect(model.runsC).to.equal(1);
        expect(model.runsD).to.equal(0);
    });

    it('should pull changes to multiple layers - higher first', function() {
        var model: any = new ViewModel();
        model.a = 11;
        var c = model.c;
        var b = model.b;
        expect(b).to.equal(11);
        expect(c).to.equal(11);
        expect(model.runsB).to.equal(1);
        expect(model.runsC).to.equal(1);
        expect(model.runsD).to.equal(0);
    });
});
