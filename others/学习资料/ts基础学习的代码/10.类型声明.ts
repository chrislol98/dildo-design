export {}
//普通的类型声明
declare let age: number
declare function getName(): string
declare class Animal {}
console.log(age)
getName()
new Animal()

//外部枚举
declare enum Seasons {
  Spring,
  Summer,
  Autumn,
  Winter,
}
let seasons = [Seasons.Spring, Seasons.Summer, Seasons.Autumn, Seasons.Winter]

//命名空间
//一个全局变量有很多子属性,就可以用namespace
//声明文件里的namespace表示一个全局变量包含很多子属性
//在命名空间内闻不需要再使用 declare了

declare namespace $ {
  function ajax(url: string, settings: object): void
  let name: string
  namespace fn {
    function extend(object: object): void
  }
}
$.ajax('/get', {})
$.name
$.fn.extend({})
//类型声明文件
