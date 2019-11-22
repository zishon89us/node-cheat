/**
 * Created by zeeshan on 11/8/2019.
 */

//------------------------------------------------------
//Typescript Interface
//Web Link=> https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
//Run : tsc index.js
//------------------------------------------------------

interface Person {
    name: string;
    last: string;
}

class Student {
    fullName: string;

    constructor(public name: string, public last: string) {
        this.fullName = name + "" + last;
    }
}

function register(person: Person) {
    return "Person " + person.name + " " + person.last;
}

let person = {name: "Jane", last: "Doe"};

console.log(register(person));