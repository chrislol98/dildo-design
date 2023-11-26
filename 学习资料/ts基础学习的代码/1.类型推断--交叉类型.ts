import { name } from './src/8';
export {}
// 从赋的值中推断出来 类型从右向左流动 
let a = 1;
//let str:string = a;
let foo = 'd';
let bar = 'zhufeng';
//通过return关键字推断返回值的类型
//底部流出
function add(a:number,b:number){
    return a+b+'';
}
let c = add(1,3);
//从左向右流动
interface Store {getState: () => object}
interface Age {age: number}
type ExStore = Store & Age
// const createStore = ():Store => {
//     //@ts-ignore
//     return null
// }
const createStore = <T>():Store&T => {
    //@ts-ignore
    return null
}
let store2: number = createStore();
store2.getState;
store2.age;






type Sum = (a:number,b:number)=>number;
type Sum2 = (a: string, b: string) => string;

let sum: Sum = (a, b) => {
    return a + b;
}
let sum2: Sum2 = (a, b) => {
    return a + b;
}













let person = {
    name:'zhufeng',
    age:11
}
// let name = person.name;
// let age = person.age;
 
let {name,age} = person;

let numbers = [1,2,3];
let c2 = numbers[0];


interface DefaultProps{
    name?:string;
    age?:number;
}
let defaultProps: DefaultProps={
   name:'zhufeng',
   age:10
}
let props = {
    ...defaultProps,
    home:'北京'
}
type Props = typeof props;

// 小心使用返回值

function addOne(a:any){
  return a+1;
}
function sum3(a:number,b:number){
//    return a+addOne(b);
   return a+addOne(b) as number;
}
let k = sum3(1,2);
//number+any = any



// api & 交叉类型 交集（子类型）!!接口的子类型参数比父类型多，但是更精细，范围更小了
interface Bird{
    name:string;
    fly():void
}
interface Person{
    talk():void;
}
type BirdPerson = Bird&Person;

let p1:BirdPerson = {
    name:'zhufeng',
    fly(){},
    talk(){}
}
p1.fly();
p1.talk();

interface X{
    a:string;
    // a:string|number;
    b:string
}
interface Y{
    a:number|boolean;
    c:string;
}
type XY = X&Y;
type YX = Y&X;
let xy:XY = {a:1,b:'',c:''}
let yx: YX = { a: 1, b: '', c: '' }

type T1 = string |number;
type T2 = number|boolean;
type T3 = T1&T2;//number 交叉类型 交集
type T4 = T1 | T2;//string | number | boolean 联合 并集


// api mixin

interface AnyObject{
    [prop:string]:any
}

function mixin<T,U>(one:T,two:U){
    const result = <(T & U)>{};
    for(let key in one)
       (<T>result)[key] = one[key];

    for (let key in two)
       (<U>result)[key] = two[key];
   return result;  
}

const x = mixin({name:'zhufeng'},{age:11});
console.log(x.name,x.age);

//typeof typ

//先定义类型,再定义变量
type Person3 ={
    name:string
}
let p3:Person3 = {
  name:'zhufeng'
}

let p4 = {
    name: 'zhufeng',
    age:10
}
type P4 = typeof p4;

//api索引访问操作符
interface Person5{
    name:string;
    age:number;
    job:{
        name:string
    }
}
let FrontEndJob: Person5['job'] = {
   name:'前端'
}

//api映射类型
interface Person6{
    name:string;
    age:number;
    gender:'male'|'female'
}
//批量把一个接口中的属性全部变成可选的
/* type PartialPerson = {
    [key in keyof Person6]?: Person6[key]
} */
type Partial<T> = {
    [key in keyof T]?: T[key]
}
type PPerson = Partial<Person6>
//interface和type区别是什么
//typeof 取一个值的类型
let o1 = {name:'zhufeng'};
type O1 = typeof o1;

type K6 = keyof Person6;
