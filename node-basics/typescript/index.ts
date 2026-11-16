//------------------------------------------------------
// TypeScript interfaces, classes and `satisfies`
// Web Link=> https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
// Run: node index.ts   (Node 22.18+ strips types natively; or: npx tsc --noEmit index.ts)
//------------------------------------------------------

interface Person {
  name: string;
  last: string;
}

class Student implements Person {
  readonly name: string;
  readonly last: string;

  // Explicit fields instead of `constructor(public name ...)`: parameter properties
  // need a compile step and do not run under Node's type stripping.
  constructor(name: string, last: string) {
    this.name = name;
    this.last = last;
  }

  get fullName(): string {
    return `${this.name} ${this.last}`;
  }
}

function register(person: Person): string {
  return `Person ${person.name} ${person.last}`;
}

// `satisfies` checks the shape without widening the inferred type
const person = { name: 'Jane', last: 'Doe' } satisfies Person;

console.log(register(person));
console.log(new Student('John', 'Smith').fullName);
