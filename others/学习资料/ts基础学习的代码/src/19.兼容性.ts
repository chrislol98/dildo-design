export {}
interface Empty<T>{
    
}
let x:Empty<string>;//{data:string}
let y: Empty<number>;//{data:number}
x=y;
// api 数字和枚举 是兼容的
enum Colors{Red,Yellow}
let c:Colors;
c = Colors.Red;
c=1;
let n:number;
n=1;
n= Colors.Red;

