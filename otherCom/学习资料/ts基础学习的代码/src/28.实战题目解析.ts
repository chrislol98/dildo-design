interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then((i) => ({
      payload: `hello ${i}!`,
      type: "delay",
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message",
    };
  }
}

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
/**
 * 1. m 取出它的所有的方法或者说函数
 * 2. 按同步异步分成二组,分别进行转换
 * 3.再把它们合并成一个对象
 */


const connect: Connect = (m) => ({
  delay: (input: number) => ({
    type: "delay",
    payload: `hello 2`,
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds(),
  }),
});
//把类型T中的函数名取出来

/* 
asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
asyncMethod<T, U>(input: T): Action<U> ;
syncMethod<T, U>(action: Action<T>): Action<U>;
syncMethod<T, U>(action: T): Action<U>; 
*/
//keyof T  count|message|delay|setMessage
//{delay:delay,setMessage:setMessage}
//keyof T = delay|setMessage
//type methodsPick<T> = { [K in keyof T]:T[K] extends Function?K:never }[keyof T];
type methodsPick<T> = keyof {
  [K in keyof T]: T[K] extends Function ? K : never;
};;
/* type EffectModuleType = {
  count: number;
  message: string;
  delay(input: Promise<number>): Promise<Action<string>>;
  setMessage(input: Action<Date>): Action<number>;
}; */
type asyncMethod<T, U> = (input: Promise<T>)=> Promise<Action<U>>;//老的异步方法签名
type asyncMethodConnect<T, U>=(input: T)=> Action<U> ;//新的异步方法签名
type syncMethod<T, U>=(action: Action<T>)=> Action<U>;//老的同步方法签名
type syncMethodConnect<T, U> = (action: T) => Action<U>; //新的同步方法签名
//"delay" | "setMessage" 取出方法的名称
type EffectModuleMethods = methodsPick<EffectModule>;
type EffectModuleMethodConnect<T>= T extends asyncMethod<infer U, infer V>?
asyncMethodConnect<U,V>:T extends syncMethod<infer U,infer V>?syncMethodConnect<U, V>:never;
type Connect = (
  module: EffectModule
) => {//M=delay EffectModule[M]
  [M in EffectModuleMethods]:EffectModuleMethodConnect<EffectModule[M]>
};

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};
let module:EffectModule=new EffectModule();
export const connected: Connected = connect(module);
