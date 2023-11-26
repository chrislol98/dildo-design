export {}
interface A{
    a:string
    b:number
    c:boolean
}
type Partial<T> = {
    [P in keyof T]+?: T[P];
};
type PartialA = Partial<A>;
let a: PartialA = {
    a:'',
    b:1
}




interface Company{
    id:number;
    name:string;
}
interface Person{
    id:number;
    name:string;
    company: Company
}
type DeepPartial<T>= {
    [U in keyof T]+?: T[U] extends object ? DeepPartial<T[U]>:T[U]
}
type PartialPerson = DeepPartial<Person>;
let p: PartialPerson = {
    id:1,
    name:'zhufeng',
    company:{}
}
//反过来 
//let obj:object = {}
namespace namespaceA{
    interface Person{
        name:string;
        age?:number;
    }
    type Required<T> = {
        [P in keyof T]-?: T[P];
    };
    type RequiredPerson = Required<Person>;
    let p: RequiredPerson={
        name:'zhufeng',
        age:11
    }
}

namespace namespaceB {
    interface Person {
        name: string;
        age: number;
    }
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    };
    type ReadOnlyNamePerson = Person&{
        readonly name:string;
    };
    let p: ReadOnlyNamePerson = {
        name: 'zhufeng',
        age: 11
    }
    //p.name = 'jiagou';
    p.age = 11;
}

namespace namespaceC {
    //Pick
    interface Person {
        name: string;
        age: number;
        gender:number
    }
    let person:Person = {name:'zhufeng',age:11,gender:1};
    type KeyOfPerson = keyof Person;// 'name'|'age'|'gender'
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };
    type PickPerson = Pick<Person,'name'|'age'>;


    //Extract
    type Extract<T, U> = T extends U ? T : never;
    //string|number
    //有条件类型分发
    type E = Extract<string | number|boolean, string|number>;
    let e: E = '1';

}

namespace namespaceD {
  /*   for(let xxx in [string,number]){

    } */
  type KeyOfAny = keyof any; //string | number | symbol 联合类型

  type Record<K extends keyof any, T> = {
      [xxx in K]: T;
       //[]表示任意属性
      //[key: string]: string,
      //[key: number]: string
  };
  let k: Record<string|number,string>= {name:'zhufeng',age:'11'};  

  //Record
  function mapObject<K extends string|number,T,U>(obj:Record<K,T>,map:(x:T)=>U){
    // 不懂 new Object不能加泛型吗？
    let result: Record<K, U> = new Object() as Record<K, U>;
    // let result: Record<K, U> = <Record<K, U>>{};
    for(const key in obj){
        result[key]=map(obj[key]);
    }
    return result;
  }
  let obj = {count1:1,count2:2,3:3};
  let map = (x: number):string => x * 2 + '';
  let newObj = mapObject<string | number, number, string>(obj, map);//{count1:2,count2:4}
}

