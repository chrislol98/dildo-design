
import name, { a, b } from './7'
//import {a,b} from './7'
console.log(name);
console.log(a,b);

export namespace zoo{
    class Elephant{}
    export class Dog{eat(){console.log('zoo dog');}}
    namespace moneyArea{
        export class Money { eat() { console.log('zoo Money'); } }
    }
}
export namespace home {
    class Wife{}
    export class Dog { eat() { console.log('home dog'); } }
}
let dogOfZoo = new zoo.Dog();
dogOfZoo.eat();
let dogOfHome = new home.Dog();
dogOfHome.eat();