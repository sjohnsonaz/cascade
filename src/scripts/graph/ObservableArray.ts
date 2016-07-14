import Observable from './Observable';

export default class ObservableArray<T> extends Observable<T> {
    constructor(value) {
        super(value);
    }

    setValue(value) {
        if (this.value !== value) {
            this.value = value;
            this.publish();
        }
    }
}
