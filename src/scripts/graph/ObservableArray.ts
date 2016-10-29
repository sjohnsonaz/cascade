import Observable from './Observable';

export default class ObservableArray<T> extends Observable<T> {
    constructor(value) {
        super(value);
    }

    setValue(value) {
        if (this.value !== value) {
            var oldValue = this.value;
            this.value = value;
            this.publish(value, oldValue);
        }
    }
}
