//exports.__esModule = true;
// cmt 加 export {} 可以让类型成为局部变量，不然类似全局变量
export {}

class Person{
    name:string='zhufeng';
    getName():void{
        console.log(this.name);
        
    }
    
}
let p1 = new Person();
p1.name = 'zhufeng';
p1.getName();

//定义存取器
class User{
    //myName:string;
    constructor(public myName:string){
        //this.myName = myName
    }
    get name(){
        return this.myName;
    }
    set name(value){
        this.myName = value;
    }
}
let user = new User('zhufeng');
user.name = 'jiagou';
console.log(user.name);
//readonly


class Animal{
    public readonly name:string;
    constructor(name:string){
        this.name = name;
    }
    changeName(name: string){
        //this.name = name;
    }
}
//public protected private  稍后再讲

//继承
