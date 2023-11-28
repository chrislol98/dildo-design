// api 接口的兼容性
// 你有的我都有，二者兼容
// 你有的我没有，二者不兼容
export {};
interface Animal {
  name: string;
  age: number;
}
interface Person {
  name: string;
  age: number;
  gender: number;
}
function getName(a: Animal): string {
  return a.name;
}
let a: Animal = {
  name: '',
  age: 10,
};
getName(a);
let p: Person = {
  name: '',
  age: 10,
  gender: 0,
};
getName(p);

// api 基本数据类型的兼容性
/* let num:string |number;
let str:string = 'zhufeng';
num = str;

let num2:{
    toString():string
}
let str2:string = 'jiagou';
num2 = str2; */
//str2 = num2;

// api 类的兼容性
namespace ab {
  class Animal {
    name: string;
  }
  class Bird extends Animal {
    age: number;
  }
  let a: Animal;
  let b: Bird;
  a = b;
  b = a;
}

// api 函数的兼容性 难点!!!!!
//cmt 1.比较参数
type Func = (a: number, b: number) => void;
let sum: Func;
function f1(a: number, b: number): void {}
sum = f1;
//参数少一个可以
function f2(a: number): void {}
sum = f2;
//少二个参数也可以
function f3(): void {}
sum = f3;
function f4(a: number, b: number, c: number): void {}
//sum = f4;
//map函数,传的可以是一个也可以是2个  map(item,index)
sum(1, 2);
//cmt2.比较返回值

type GetPerson = () => { name: string; age: number };
let getPerson: GetPerson;

function g1() {
  return { name: 'zhufeng', age: 10 };
}
getPerson = g1;
function g2() {
  return { name: 'zhufeng', age: 10, gender: 0 };
}
getPerson = g2;
function g3() {
  return { name: 'zhufeng' };
}
getPerson = g3;

getPerson().age.toFixed(2);

//cmt 一切的一切是为了类型安全,为了使用的时候不报错
//cmt返回值类型是协变的，而参数类型是逆变的
//cmt返回值类型可以传子类, 参数可以传父类;
//cmt参数逆变父类 返回值协变子类 搀你父,返鞋子
