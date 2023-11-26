/**
 *
 * 通过一些关键字typeof instanceof for in 来缩小范围
 */
export {};
function double(input: string | number) {
  if (typeof input === 'string') {
    console.log(input);
  } else if (typeof input === 'number') {
    console.log(input);
  }
}
class Animal {}
class Bird extends Animal {}
class Dog extends Animal {}
function getName(animal: Animal) {
  if (animal instanceof Bird) {
    console.log(animal);
  } else if (animal instanceof Dog) {
    console.log(animal);
  }
}
//null保护
function getFirstLetter(s: string | null) {
  /* if(s === null){
        return '';
    } */
  //s = s||'';
  /*  function log() {
        s=s||'';
    }
    log(); */
  return s!.charAt(0);
}

//链判断运算符
/* let a = {b:2}
let result = a?.b;
// a===null?undefined:a.b;
console.log(result);
let x = 'b';
a?.[x];
a?.b();
a?.[x]() */
function a(b: { [a: PropertyKey]: any } | null) {
  //   b?.c;
  b.c;
}
//链判断运算符处于stage1 ts也不支持

//可辨识的联合类型
interface WarningButton {
  class: 'waring';
  text1: '修改';
}
interface DangerButton {
  class: 'danger';
  text2: '删除';
}
type Button = WarningButton | DangerButton;
function getButton(button: Button) {
  if (button.class === 'waring') {
    console.log(button);
  }
  if (button.class === 'danger') {
    console.log(button);
  }
}

interface User {
  username: string;
}

type Action =
  | {
      type: 'add';
      payload: User;
    }
  | { type: 'delete'; payload: number };
const reducer = (action: Action) => {
  switch (action.type) {
    case 'add':
      action.payload.username;
      break;
    case 'delete':
      let id: number = action.payload;
      break;
  }
};

interface Bird {
  swing: number;
}
interface Dog {
  leg: number;
}
function getNumber(x: Bird | Dog) {
  if ('swing' in x) {
    console.log(x);
  } else {
    console.log(x);
  }
}
//自定义的类型保护 难度!!
