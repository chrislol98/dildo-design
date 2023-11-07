// 懒代理，优化性能
if (!isObservable(result)) {
  return createObservable(target, key, result);
}
// 单例模式
if (observableResult) {
  return observableResult;
}

// RawReactionsMap
reactionsMap = new Map([[key, reactions]]);
RawReactionsMap = new Map([[target, reactionsMap]]);

// 收集依赖
tracker();

// 响应式核心：当响应式数据a改变了，对应用到a的函数要重新计算，目的就是为了得到最新的结果
// 不懂 收集响应式数据的observableValues.username的回调
autorun(() => {
  console.log(observableValues.username);
});
// 不懂 修改响应式数据后重新执行回调
observableValues.username = 'jiagou';

// proxy用法
let a = { b: { c: 1 } };
const base = {
  get(target, key) {
    console.log(target, key);
    if (typeof target[key] === 'object') {
      return new Proxy(target[key], base);
    }
    return target[key];
  },

  set(target, key, value) {
    console.log(value, 'set');
    target.key = new Proxy(value, base);
  },
};

let pA = new Proxy(a, base);
pA.b;
