export {}
type Inter1<T, U> = Extract<keyof T, keyof U> & Extract<keyof U, keyof T>;
type Inter2<T, U> = Extract<keyof T, keyof U>;
type Inter3<T, U> = Extract<keyof U, keyof T>;

type T1 = {name:string,age:number};
type T2 = {age: string,married:boolean };
type K1 = Inter1<T1,T2>
type K2 = Inter2<T1, T2>
type K3 = Inter3<T1, T2>

