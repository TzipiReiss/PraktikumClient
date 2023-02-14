import Child from './Child';

export default class User {
    constructor(
        public userId: number,
        public firstName: string,
        public lastName: string,
        public dateOfBirth: Date,
        public idNumber: string,
        public gender: number,
        public hmo: number,
        public children: Child[] = []
    ) { }
}