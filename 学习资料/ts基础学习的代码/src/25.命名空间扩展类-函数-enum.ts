export {}
/* interface A{
    name:string
}
interface A{
    age:number;
}

type AAA = A; */
/**
 * 声明一个类的时候
 * 得到2 个类型  一个实构造 函数的类型 一个是实例的类型
 */
class Person1{
    name:string
}
let p: Person1={name:'zhufeng'};

interface Person2{
    new (name:string):Person
}
let c1: Person1;//Person 指的是构造函数本身 是一值 
let c2:Person2;
c1=c2!;

class Form {
  username: Form.Item = new Form.Item();
  password: Form.Item = new Form.Item();
}
namespace Form{
    export class Item{}
}
let item:Form.Item = new Form.Item();

type ccc =  Form;
let a:ccc = {username: new Form.Item(),password: new Form.Item()}


function hello(){

}
namespace hello{
    export let words = 'words';
}
hello.words;
//使用命名空间扩展枚举类型
enum Color{
    red=1,
    yellow=2,
    blue=3
}
namespace Color{
    export const green=4;
    export const purple=5;
}
Color.purple;

import { createStore, Store, AnyAction } from "redux";
let reducer = (state:any)=>state;
type ExtStore = Store &{age:number,home:string}
let store: ExtStore = createStore(reducer);
store.age;



