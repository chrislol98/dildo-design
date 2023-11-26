//public private protected

class Father {
    static fatherName: string = 'fatherName';
    toString(){console.log('Father');
    }
    public name: string;//public 自己 自己的子类 和其它类都能访问
    protected age: number;//protected 自己和自己子类能访问,其它类不能访问
    private money: number;//private 自己能访问,子类和其它类不能访问
    constructor(name: string, age: number, money:number) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
    getName(): string {
        return this.name;
    }
}
class Child extends Father {
    static childName: string = 'childName';
    constructor(name: string, age: number, money: number) {
        super(name, age,money);
    }
    public toString() {
        // cmt
        super.toString();
        console.log('Child');
    }
    public desc(){
        console.log(this.name,this.age);
    }
}
//动物 哺乳动物
let father = new Father('zhufeng', 11, 1);
//father.toString()
let child = new Child('zhufeng',11,1);
//console.log(child.name);

child.toString()

//Child.fatherName;
//Child.childName;
//child.age;
//child.money;
