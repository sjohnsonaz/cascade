import { observable } from '../cascade/Decorators';

class ViewModel {
    runs = 0;
    @observable a = 1;
    @observable b = 2;
    @observable get ab() {
        this.runs++;
        return this.a + this.b;
    }
}

describe('Graph.dispose', function () {
    it('should dispose subscriptions to props', function () {
        var model: any = new ViewModel();
        var ab = model.ab;
        model._graph.dispose();
        expect(model._graph.observables.a.subscribers.length).toBe(0);
        expect(model._graph.observables.b.subscribers.length).toBe(0);
        expect(model.runs).toBe(1);
    });
});
