//React也非常重要的一个知识点
export {};
/**
 * // api 当我们写一个类/函数的时候,会得到2个类型
 * // cmt 1. 默认就是类的实例类型
 * // cmt 2. typeof是类本身的类型
 */

class Component {
  static myName: string = '静态名称属性';
  myName: string = '实例名称属性';
  xxx = 3333333;
  ggg = 2222222;
}
let com = Component;
//Component类名本身表示的是实例的类型
//ts 一个类类型 一个叫值
//冒号后面的是类型放在=后面的是值
// let c: Component = new Component();
let c: Component = { myName: '实例名称属性', xxx: 3333333, ggg: 2222222 };
// let f: Component = com;
let f: typeof Component = com;

namespace b {
  function Component() {
    this.myName = '实例名称属性';
  }
  let com = Component;
  Component.myName = '静态名称属性';
  // let c: Component = new Component();
  let c: Component = { myName: '实例名称属性' };

  let f: typeof Component = com;
  //   let f:  Component = com;
}

namespace aaa {
  class Animal {
    name: string;
    static age: number;
  }
  type A = Animal;
  type B = typeof Animal;
  let a: A = { name: '1', age: 11 };
  let b: B = { name: '1' };
}
