import {observable} from '../../../scripts/modules/Cascade';

export default class User {

    @observable firstName: string;
    @observable lastName: string;
    @observable phone: number[];
    @observable get fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = [1, 2, 3];
    }
}
