import { name } from './src/8';
export {}
/**
 * 条件类型
 */
interface Fish{
    name1:string;
}
interface Water{
    name2:string;
}
interface Bird{
    name3:string;
}
interface Sky{
    name4:string;
}
//type Condition<T> = T extends Fish?Water:Sky;
type Condition<T> = { t: T } extends { t: Fish} ? Water : Sky;
//let con:Condition<Fish> = {name2:'水'};

//条件类型的分发
let con1: Condition<Fish | Bird> = { name4:''};
let con2: Condition<Fish | Bird> = { name4: '' };


// 找出T中不包含U的部分
type Diff<T,U> = T extends U?never:T;
type R = Diff<'a'|'b'|'c'|'d' , 'a'|'b'|'c'>;  
type R2 = 'd';


type Filter<T,U> = T extends U?T:never;
type R3 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  


// api 内置条件类型
//Exclude
type Exclude<T, U> = T extends U ? never : T;
type R4 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  
type Extract<T, U> = T extends U ? T : never;
//Extract
type R5 = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'b' | 'c'>;  //Pick
//NonNullable
type NonNullable<T> = T extends null | undefined ? never : T;
type R6 = NonNullable<'a' | null | undefined>;  
//ReturnType

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

function getUser(a:string,b:number){
    return {name:'zhufeng',age:10};
}
//let t = getUser();
type GetUserType = typeof getUser;
/* type ReturnUser = ReturnType<GetUserType>;
let u: ReturnUser = {
    name:'zf',
    age:10
} */
/**
 * Obtain the parameters of a function type in a tuple
 */
//P = [string,number]
type Parameters<T> = T extends ((...args: infer P) => any) ? P : never;
// type Parameters<T> = T extends ((...args: infer P) => infer R) ? P|R : never;
type X1 = {}
type ParamsType = Parameters<GetUserType>;
//InstanceType 

class Person8{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    getName(){console.log(this.name);}
}
//获取类的构造函数的参数类型
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (
    ...args: infer P) => any ? P : never;
type Params = ConstructorParameters<typeof Person8>;
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

type Person8Instance = InstanceType<typeof Person8>;
let instance: Person8Instance={
    name:'zf',
    getName(){}
}


//api infer应用案例
//tuple转union
type ElementOf<T> = T extends Array<infer E>?E:never;
type Ttuple = [string,number,boolean];
type TupleToUnion = ElementOf<Ttuple>;//string|number // 联合类型

// 参数=>返回值   参数:返回值

type First<T> = T extends {name:infer A} ?A:never;
type K11 = First<{name:string}>

//联合类型转成交叉类型
//string|number => string&number

type T1 = {name:string};
type T2 = {age:number};
type ToIntersection<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void }?U:never;
type T3 = ToIntersection<{ a: (x: T1) => void, b: (x: T2) => void}>;
//T1 & T2 交集 交叉类型
let t33:T3 = {name:'',age:10};

