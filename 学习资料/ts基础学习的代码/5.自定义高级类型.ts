/**
 * 差集  A-B  = Exclude
 */
export type SetDifference<A,B>= A extends B ?never:A;

type A = string|number;
type B = number|boolean;
type AB = SetDifference<A,B>;

//Omit=Exclude+Pick
//keyof T = name|age|visible;
//K = age
//SetDifference name|visible
//{name:string,visible:boolean}
type Omit<T,K extends keyof any>=Pick<T,SetDifference<keyof T,K>>;

type Props = {name:string,age:number,visible:boolean};
type OmitAgeProps = Omit<Props,'age'>;
// {name:string,visible:boolean};
//Diff
namespace na{
    type Props = { name: string, age: number, visible: boolean };
    type DefaultProps = {age:number};
    type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
    type DiffProps = Diff<Props, DefaultProps>;//{name:string,visible:boolean};
}

namespace nb {
    //InterSection 交叉属性
    type InterSection<T extends object, U extends object>=Pick<T,
        Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;
    type Props = { name: string, age: number, visible: boolean };
    type DefaultProps = { age: number };
    //type InterProps = Props & DefaultProps;
    type DuplicateProps = InterSection<Props, DefaultProps>;
}

namespace nc {
//Overwrite
    type OldProps = { name: string, age: number, visible: boolean };
    type NewProps = {age:string,other:string};
    //{ name: string,visible: boolean ,age:string}
    type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
    type InterSection<T extends object, U extends object> = Pick<T,
        Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;

    type Overwrite<
       T extends object,
       U extends object,
       // {name: string,visible: boolean }  &  {age:string}  {name: string,visible: boolean,age:string }
       I = Diff<T,U> & InterSection<U,T>
    >=Pick<I,keyof I>
    //{ name: string, age: string, visible: boolean };
    //{ name: string, age: string, visible: boolean,other:string };
    //type ReplacedProps = Overwrite<OldProps, NewProps>;
    //type ReplacedProps = OldProps& NewProps;
    type ReplacedProps = Overwrite<OldProps, NewProps>;
    let p: ReplacedProps={name:'',age:'',visible:true}

}


namespace nd {

    type c = {a: 1}&{b: 2}
    type d= Compute<{a: 1}&{b: 2}>


    //Merge = Compute+Omit<U,T>

    namespace A {
        export  type C = number;
        interface A {
            a: 1
        }
        interface A {
            b: 1
        }
    }
    interface C {
        d: 1
    }
    type D = Compute<A& C>
    

    type O1 ={
        id:number;
        name:string
    }
    type O2 = {
        id:number;
        age:number;
    }
    //{id:number,name:string,age:number}
    //type R2 = Merge<O1,O2>;
    type Compute<A extends  any>=A extends Function?A:{[K in keyof A]:A[K]}
    type Compute2<A>= A;
    type R1 = Compute<string>;//{x:'x',y:'y'}
    type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;
    type Merge<O1 extends object, O2 extends object> = Compute<
      O1&Omit<O2,keyof O1>
    >
    type R2 = Merge<O1,O2>;
    /**
    type R2 = {
        id: number;
        name: string;
        age: number;
    }
     * 
     */

     type K1 = any;
     let K:K1 =true;
     let k2:K1 = function(){};
     type K2 = keyof any;
     //let k22:K2 = true;

    //Extract < keyof T, keyof U >，Extract < keyof U, keyof T > 他们的结果不是一样的吗？写一个不可以么
    //这里type声明的对象和interface的效果是一样的吧，oldprops，newprops
    type SS ={name:string}
    interface SS2{name:string}

    

}