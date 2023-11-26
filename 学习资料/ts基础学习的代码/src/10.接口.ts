export {};
//描述对象的形状
interface Speakable {
  name: string;
  speak(): void;
}

let speakMan: Speakable = {
  name: 'zhufeng',
  speak() {},
};
//行为的抽象
//同名的接口可以写多少,类型会自动合并
interface Speakable {
  speak(): void;
}
interface Eatable {
  eat(): void;
}
class Person implements Speakable, Eatable {
  name: string;
  speak() {
    throw new Error('Method not implemented.');
  }
  eat(): void {
    throw new Error('Method not implemented.');
  }
}
// api [key: string]: any; 任意属性
interface Person2 {
  readonly id: number;
  name: string;
  [key: string]: any;
}
let p: Person2 = {
  id: 1,
  name: 'zhufeng',
  age: 10,
  home: 'dd',
  11: 11,
};
// api 接口的继承
interface Speakable2 {
  speak(): void;
}
interface Speakable3 {
  speak: () => void;
}

// api interface extends
interface SpeakChinese extends Speakable2 {
  speakChinese(): void;
}

// api interface implements
class ChineseMan implements SpeakChinese {
  speakChinese(): void {
    throw new Error('Method not implemented.');
  }
  speak() {
    throw new Error('Method not implemented.');
  }
}

// api interface readonly
interface Person3 {
  readonly id: number;
}
let p3: Person3 = {
  id: 1,
};
//p3.id = 2;

// api interface 函数类型接口
interface Discount {
  (price: number): number;
}
const discount: Discount = (price: number): number => {
  return price * 0.8;
};
// api interface 可索引接口
// 对数组和对象进行约束
interface User {
  [xx: number]: string;
}
let user: User = {
  0: '0',
  1: '1',
  2: '2',
};
let arr: User = ['1', '2', '3'];

// api interface implements 如何用接口约束类
interface Speakable {
  speak(): void;
}
// api interface 构造函数类型
class Animal {
  constructor(public name: string) {}
}
//如果是修饰普通函数
//加上new之后就是用来描述类的构造函数
interface WithNameClass {
  new (name: string): any;
}
let wc: WithNameClass = Animal;
function createClass(clazz: WithNameClass, name: string) {
  return new clazz(name);
}
let a = createClass(Animal, 'zhufeng');
console.log(a.name);


