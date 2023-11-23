import { createContainer, updateContainer } from 'react-reconciler/src/ReactFiberReconciler';
import { listenToAllSupportedEvents } from 'react-dom-bindings/src/events/DOMPluginEventSystem';
// cmt 里面就是 FiberRootNode
// cmt 为了支持多环境，比如 react-native 里面就是 REactNativeRoot
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

// api render
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = '';

  
  // cmt 1. 创建 update， payload 为子fiber
  // cmt 2. 触发更新
  updateContainer(children, root);
};
// cmt 创建根dom节点 FiberRootNode
// cmt 创建根fiber节点 HostRootFiber
// cmt FiberRootNode.current = HostRootFiber HostRootFiber.stateNode = FiberRootNode
// api createRoot
// xzc 核心 初始的时候只有一个根节点div#root, 所以最开始的一棵fiber树就是只有一个HostRootFiber节点的fiber树
// xzc 核心 第一次更新fiber树的时候走的是挂载的逻辑，会创建fiber节点
// xzc 核心 第二次及以后走的时候更新的逻辑，会尝试复用fiber节点
export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  // api 事件 listenToAllSupportedEvents
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
