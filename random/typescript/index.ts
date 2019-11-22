/**
 * Created by zeeshan on 11/8/2019.
 */

//------------------------------------------------------
//Typescript Interface
//Web Link=> https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
//Run : tsc index.js
//------------------------------------------------------

interface User {
    name: string;
    email: string;
}

function register(user: User) {
    return "User " + user.name + " has been registered with email " + user.email;
}

let user = { name: "Jane Doe", email: "jane@doe.com" };

console.log(register(user));