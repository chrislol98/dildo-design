
export {}
interface Type1 {
    (name: string): any
    age:number
}

interface Type2 {
   a: (name: string)=> any
}
let t: any = (name: string) => { };
t.age = 10;
let t1: Type1 = t
let t2: Type2 = {
    a: t1
}

interface Array<T> {
    [Symbol.iterator](): IterableIterator<T>
}