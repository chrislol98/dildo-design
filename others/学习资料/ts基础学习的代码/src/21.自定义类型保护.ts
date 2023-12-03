interface Bird {
  swing: number;//2
}
interface Dog {
  leg: number;//4
}
//自定义的类型保护了 TODO

/* function isType(type:Type1|Type2):type is Type1{

} */
// api 类型谓词 parameterName is Type 哪个参数是什么类型
function isBird(y:Bird|Dog):y is Bird{
  return (y as Bird).swing == 2;
}
function getAnimal(x: Bird | Dog) {
    if(isBird(x)){
        console.log(x);
    }else{
        console.log(x);
    }
}