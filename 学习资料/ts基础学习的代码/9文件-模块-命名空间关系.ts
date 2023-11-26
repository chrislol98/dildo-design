/* import {zoo} from './8';
let dogOfZoo = new zoo.Dog();
dogOfZoo.eat(); */
/**
 * 文件 模块 命名空间的关系
 */

export namespace zoo {
  export class Cat {
    eat() {
      console.log('zoo dog')
    }
  }
}
let Animal = new zoo.Dog()
