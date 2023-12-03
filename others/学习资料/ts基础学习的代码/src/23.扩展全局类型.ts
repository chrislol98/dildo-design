//扩展局部变量的类型
/* declare var String:StringConstructor;
interface StringConstructor{
    new(value?:any):String;
    (value?:any):string;
    readonly prototype:String;
}
interface String {
    toString():string;
}
 */
//相同名称的interface会进行合并
export {}
declare global{
    interface String {
       double(): string;
    }

    interface Window {
      myName: string;
    }
}


String.prototype.double = function(){
    return this+this;
}
let result = new String("hello").double();//hellohello
console.log(result);


console.log(window.myName);




