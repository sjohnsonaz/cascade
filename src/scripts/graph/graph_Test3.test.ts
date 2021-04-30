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

describe('Graph', function () {
    it('should pull changes to dirty computed values', function () {
        var model: any = new ViewModel();
        model.a = 11;
        expect(model.ab).toBe(13);
        expect(model.runs).toBe(1);
    });
});
