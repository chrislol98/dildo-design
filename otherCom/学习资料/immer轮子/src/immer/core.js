import * as is from './is';
/**
 * @param {*} baseState 原状态
 * @param {*} producer 处理器或者说生产者
 */
export let INTERNAL = Symbol('INTERNAL');

// api immer 返回一个不同的值（浅拷贝），a.b.c = 5,只让a,b,c不同，a.c a.d a.g ...其他节点复用
// 原理： 1对象每一个属性会创建一个map(keyToProxy),来存储所有的子属性2原来的对象不变，只修改子属性
// 原理： 子属性变，所有祖先属性全部要修改     a.b.c = 2；   c变了，b变了，a也变了，（内存指向变了）
// 
export function produce(baseState, producer) {
  let proxy = toProxy(baseState);
  producer(proxy);
  const internal = proxy[INTERNAL];
  return internal.mutated ? internal.draftState : internal.baseState;
}
export function toProxy(baseState, callParentCopy) {
  // 懒加载存储, 存自己的Proxy(子节点),只放自己的儿子
  let keyToProxy = {}; 
  let internal = {
    // 永远不变
    baseState,
    // 浅拷贝一份草稿，修改草稿上的属性
    draftState: createDraftState(baseState), //{list:baseState.list}
    keyToProxy,
    mutated: false, //此对象是否发生了变更
  };
  return new Proxy(baseState, {
    get(target, key) {
      //key=list
      if (key === INTERNAL) {
        //如果你访问代理对象的INTERNAL属性，我们就返回这个internal对象
        return internal;
      }
      let value = target[key]; //baseState.list=['1']
      //当你访问某个属性的时候，我们就要对这个属性进行代理
      if (is.isObject(value) || is.isArray(value)) {
        if (key in keyToProxy) {
          //判断keyToProxy对象里是否有key属性
          return keyToProxy[key];
        } else {
          keyToProxy[key] = toProxy(value, () => {
            internal.mutated = true; //任意一个儿子变了，自己相当于也会变
            const proxyChild = keyToProxy[key]; //取出这个key的对应的代理对象 list的代理对象
            let { draftState: childDraftState } = proxyChild[INTERNAL];
            internal.draftState[key] = childDraftState;
            callParentCopy && callParentCopy();
          });
        }
        return keyToProxy[key]; //如果是引用类型，则要先得到对应的Proxy对象，然后返回这个代理对象
      } else if (is.isFunction(value)) {
        internal.mutated = true;
        callParentCopy && callParentCopy();
        return value.bind(internal.draftState); //push 的this指针指向draftState
      }2值，都要把当前mutated属性设置true
      //const {draftState} = internal;//设置值的时候，不修改baseState, 而是修改draftState，也就是草稿状态
      internal.draftState[key] = value;
      callParentCopy && callParentCopy();
      return true;
    },
  });
}
function createDraftState(baseState) {
  if (is.isObject(baseState)) {
    return Object.assign({}, baseState);
  } else if (is.isArray(baseState)) {
    return [...baseState];
    // } else if (map set ........ 还有这些情况，太多不写了) {
    // todo
    // }
  } else {
    return baseState; //基本 string number boolean
  }
}
