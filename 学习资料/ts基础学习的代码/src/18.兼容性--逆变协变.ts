export {};

class Animal {}
class Dog extends Animal {
  public name: string = 'Dog';
}
class BlackDog extends Dog {
  public age: number = 10;
}
class WhiteDog extends Dog {
  public home: string = '北京';
}
let animal: Animal;
let dog: Dog;
let blackDog: BlackDog;
let whiteDog: WhiteDog;
type Callback = (dog: Dog) => Dog;
function exec(callback: Callback): void {}
// api 逆变协变
// api数据流动方向  往下
// api为了安全考虑，参数可以传自己和自己的父类  往上  逆变
// api为了安全考虑，返回值可以传自己和自己的子类  往下 协变
//  api ts中其实参数是双向协变的 strictFunctionTypes:false,是双向协变

//cmt 一切的一切是为了类型安全,为了使用的时候不报错
//cmt返回值类型是协变的，而参数类型是逆变的
//cmt返回值类型可以传子类, 参数可以传父类;
//cmt参数逆变父类 返回值协变子类 搀你父,返鞋子
/**
 //cmt 一切都是为了安全考虑
 * //cmt参数可以传自己和自己的父类
 * //cmt返回值可以传自己和自己的子类
 * 四种情况
 * 1.参数传子类返回值子类  n
 * 2.参数是子类返回值是父类 n
 * 3.参数是父类返回值是父类 n
 * 4.参数是父类返值是子类 y
 */
type ChildToChild = (blackDog: BlackDog) => BlackDog;
let childToChild: ChildToChild;
//exec(childToChild);//n
type ChildToParent = (blackDog: BlackDog) => Animal;
let childToParent: ChildToParent;
//exec(childToParent);//n
type ParentToParent = (animal: Animal) => Animal;
let parentToParent: ParentToParent;
//exec(parentToParent);//n
type ParentToChild = (animal: Animal) => BlackDog;
let parentToChild: ParentToChild;
exec(parentToChild); //y

namespace AAA {
  type Callback = (a: string | number) => string | number;
  function exec(callback: Callback) {}
  type ChildToChild = (a: string) => string;
  let childToChild: ChildToChild;
  exec(childToChild); //n
  type ChildToParent = (a: string) => string | number | boolean;
  let childToParent: ChildToParent;
  exec(childToParent); //n
  type ParentToParent = (
    a: string | number | boolean
  ) => string | number | boolean;
  let parentToParent: ParentToParent;
  exec(parentToParent); //n
  type ParentToChild = (a: string | number | boolean) => string;
  let parentToChild: ParentToChild;
  exec(parentToChild); //y
}



