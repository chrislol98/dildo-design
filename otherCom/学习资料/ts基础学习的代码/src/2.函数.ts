// api 函数声明（2）和函数重载（1）
type F = () => void;
type FF = { (): void };
function FFF(): number;
function FFF(): string;
function FFF(): any {}
let FFFF = <T>(a: T) => {}




function hello(name: string): void {
  console.log('hello', name);
}
hello('zhufeng');

type GetName = (firstName: string, lastName: string) => string;
let getName: GetName = function (firstName: string, lastName: string): string {
  return firstName + lastName;
};

function print(name: string, age?: number): void {
  console.log(name, age);
}
print('zhufeng', 11);
function ajax(url: string, method: string = 'GET') {
  console.log(url, method);
}
ajax('/');

function sum(...numbers: number[]) {
  return numbers.reduce((val, item) => val + item, 0);
}
console.log(sum(1, 2, 3));
//函数的重载
let obj: any = {};
//function attr():void
/**
 * 如果传的val是一个字符串赋给obj.name
 *                 数字,赋给obj.age
 * @param val
 */
function attr(val: string): void;
function attr(val: number): void;
function attr(val: any): void {
  if (typeof val === 'string') {
    obj.name = val;
  } else if (typeof val === 'number') {
    obj.age = val;
  }
}
attr('zhufeng');
attr(10);
// attr(true);
function add(a: string, b: string): void;
function add(a: number, b: number): void;
function add(a: number | string, b: string | number): void {}
add('a', 'b');
add(1, 2);

//add(1,'b');

//非常有名的案例 compose
