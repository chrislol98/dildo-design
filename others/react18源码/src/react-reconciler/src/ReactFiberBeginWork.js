import { HostComponent, HostRoot, HostText, IndeterminateComponent, FunctionComponent } from './ReactWorkTags';
import { processUpdateQueue, cloneUpdateQueue } from './ReactFiberClassUpdateQueue';
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber';
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { renderWithHooks } from 'react-reconciler/src/ReactFiberHooks';
import { NoLane, NoLanes } from './ReactFiberLane';

/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current 老的父Fiber
 * @param {*} workInProgress 新的你Fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */

// api beginWork/dom-diff reconcileChildren 
// 根据新的 虚拟DOM 生成子 fiber 单向链表（注意： 不是子 fiber 树）
// 并且返回该链表的头结点, 赋值给当前 workInProgress 的 child,旧的fiber子链表失去引用被垃圾回收了

// cmt 第一次渲染，只有根workInProgress有current，其他fiber对应的current，也就是fiber.alternate都是null
function reconcileChildren(current, workInProgress, nextChildren) {
  // cmt 如果此新fiber没能对应的老fiber,说明此fiber是新创建的，如果这个父fiber是新的创建的，它的儿子们也肯定都是新创建的。所以不用标记副作用，直接在completeWork阶段插入真实DOM即可
  if (current === null) {
    // xzc 1. 挂载（挂载===创建）子fiber链表
    // xzc 2. workInProgress.child指向子fiber链表的头部
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // xzc 为了最大程度复用旧fiber节点
    //如果说有老Fiber的话，做DOM-DIFF 拿老的子fiber链表和新的子虚拟DOM进行比较 ，进行最小化的更新
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  }
}
function updateHostRoot(current, workInProgress, renderLanes) {
  const nextProps = workInProgress.pendingProps;
  cloneUpdateQueue(current, workInProgress);
  //需要知道它的子虚拟DOM，知道它的儿子的虚拟DOM信息

  // api update processUpdateQueue
  processUpdateQueue(workInProgress, nextProps, renderLanes); // workInProgress.memoizedState={ element }

  const nextState = workInProgress.memoizedState;
  //nextChildren就是新的子虚拟DOM
  const nextChildren = nextState.element; //h1

  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child; //{tag:5,type:'h1'}
}
/**
 * 构建原生组件的子fiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber h1
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  // 不懂 pendingProps 是哪里来的？？？？？？？
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  //判断当前虚拟DOM它的儿子是不是一个文本独生子
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}
/**
 * 挂载函数组件
 * @param {*} current  老fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} Component 组件类型，也就是函数组件的定义 函数组件的fiber.type是函数本身 类组件的fiber.type是class类本身
 */
// api beginWork mountIndeterminateComponent 函数组件挂载走这个
export function mountIndeterminateComponent(current, workInProgress, Component) {
  const props = workInProgress.pendingProps;
  //const value = Component(props);
  // api beginWork renderWithHooks
  // 重新渲染出虛擬節點，不是渲染出真實dom
  // react浏览器插件中的re-render，指的就是对应函数fiber.type，也就是函数组件的执行
  const value = renderWithHooks(current, workInProgress, Component, props);
  workInProgress.tag = FunctionComponent;
  reconcileChildren(current, workInProgress, value);
  return workInProgress.child;
}


// api beginWork updateFunctionComponent 函数组件更新走这个
export function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
  const nextChildren = renderWithHooks(current, workInProgress, Component, nextProps, renderLanes);
  // 不懂 function A(props) {return props.children + '2222222'}     <A>3333333</A>
  // 不懂 A的子组件是props.children + '2222222', 3333333只是props.children
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}
/**
 *
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的fiber h1
 * @returns
 */

export function beginWork(current, workInProgress, renderLanes) {
  //在构建fiber树之后清空lanes
  workInProgress.lanes = 0;
  switch (workInProgress.tag) {
    // 因为在React里组件其实有两种，一种是函数组件，一种是类组件，但是它们都是都是函数
    case IndeterminateComponent:
      return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
    case FunctionComponent: {
      const Component = workInProgress.type;
      const nextProps = workInProgress.pendingProps;
      return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
    }
    // xzc 处理根节点的update
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case HostText:
      return null;
    default:
      return null;
  }
}
