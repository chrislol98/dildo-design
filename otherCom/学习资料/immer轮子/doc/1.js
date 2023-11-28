//共享 可变状态是万恶之源
let objA = {name:'zhufeng'};
let objB = objA;
objB.name = 'jiagou';
console.log(objB);
console.log(objA);
//如何解决引用类型的数据
//1.深拷贝
//2.immutable-js