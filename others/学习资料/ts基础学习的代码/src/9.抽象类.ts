export {}
abstract class Animal{
   name:string;
   abstract speak():void
}
//多态 同一个方法不同的子类有不同的实现
abstract class Cat extends Animal{
    abstract speak2(): void
}
//let c = new Cat();
class Dog extends Animal {
    speak(): void {
        console.log('汪汪汪');
    }
}
/**
 * // cmt 重写(override) 子类重写继承自父类方法
 * // cmt 重载(overload) 函数的重载
 */
function double(val: string)
function double(val: number)
function double(val:any){
    if (typeof val === 'number'){
        return val*2;
    } else if (typeof val === 'string'){
        return val + val;
    }
}
double(2);
double('a');
//double(true);
//compose
// cmt 继承和多态