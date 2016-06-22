import Observable from './Observable';

export default class ObservableArray extends Observable {
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
