import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalizeInitialChildren,
  prepareUpdate,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { NoFlags, Update, Ref } from './ReactFiberFlags';
import { HostComponent, HostRoot, HostText, FunctionComponent } from './ReactWorkTags';
import { NoLanes, mergeLanes } from './ReactFiberLane';

function markRef(workInProgress) {
  workInProgress.flags |= Ref;
}
/**
 * 把当前的完成的fiber所有的子节点对应的真实DOM都挂载到自己父parent真实DOM节点上
 * @param {*} parent 当前完成的fiber真实的DOM节点
 * @param {*} workInProgress 完成的fiber
 */

// api appendAllChildren 插入 *** 子 *** dom节点（跟子fiber单链表同一个原理）
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    // cmt 1.a 找到真实的dom节点, 插入
    // cmt 1.b 如果是函数组件，找第一个child
    //如果子节点类型是一个原生节点或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
      //如果第一个儿子不是一个原生节点，说明它可能是一个函数组件
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }

    // cmt 3. 回到当前节点，完成操作
    if (node === workInProgress) {
      return;
    }

    // cmt 2. 找sibling, 插入，如果没有sibling，回到parent找sibling
    //如果当前的节点没有弟弟
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      //回到父节点
      node = node.return;
    }
    node = node.sibling;
  }
}
function markUpdate(workInProgress) {
  workInProgress.flags |= Update; //给当前的fiber添加更新的副作用
}
/**
 * 在fiber(button)的完成阶段准备更新DOM
 * @param {*} current button老fiber
 * @param {*} workInProgress button的新fiber
 * @param {*} type 类型
 * @param {*} newProps 新属性
 */
function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps; //老的属性
  const instance = workInProgress.stateNode; //老的DOM节点
  //比较新老属性，收集属性的差异
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  // updatePayload = ['flex', '1', 'color', 'green', 'width', '100px']
  //让原生组件的新fiber更新队列等于[]
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
  }
}
/**
 * 完成一个fiber节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的构建的fiber
 */

// api completeWork
// cmt 作用 初次挂载的时候，创建真实的DOM节点，把自己所有的儿子都添加到自己的身上
// 未知 做一下收尾的工作
// cmt 优化 冒泡flags和lanes

export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    //如果完成的是原生节点的话
    case HostComponent:
      ///现在只是在处理创建或者说挂载新节点的逻辑，后面此处分进行区分是初次挂载还是更新
      //创建真实的DOM节点
      const { type } = workInProgress; // 原生节点的type是 div span h1
      //如果老fiber存在，并且老fiber上真实DOM节点，要走节点更新的逻辑
      if (current !== null && workInProgress.stateNode !== null) {
        // api completeWork updateHostComponent 标记更新副作用
        updateHostComponent(current, workInProgress, type, newProps);
        if ((current.ref !== workInProgress.ref) !== null) {
          markRef(workInProgress);
        }
        // 初次挂载的逻辑
      } else {
        const instance = createInstance(type, newProps, workInProgress);
        // xzc 优化 把自己所有的儿子都添加到自己的身上
        // xzc 优化 而不用先标记placement副作用，再在commit阶段插入，每个节点都有一个placement副作用, 增加commitwork处理时间。subtreeFlags难以优化
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        // 不懂 newProps哪里来的？
        // api finalizeInitialChildren  根据newProps的值，修改真实dom的属性
        finalizeInitialChildren(instance, type, newProps);
        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      bubbleProperties(workInProgress);
      break;
    case FunctionComponent:
      bubbleProperties(workInProgress);
      break;
    case HostText:
      //如果完成的fiber是文本节点，那就创建真实的文本节点
      const newText = newProps;
      //创建真实的DOM节点并传入stateNode
      workInProgress.stateNode = createTextInstance(newText);
      //向上冒泡属性
      bubbleProperties(workInProgress);
      break;
  }
}

function bubbleProperties(completedWork) {
  let newChildLanes = NoLanes;
  let subtreeFlags = NoFlags;
  // cmt 遍历当前fiber的所有子节点，把所有的子节的副作用，以及子节点的子节点的副作用全部合并
  let child = completedWork.child;
  while (child !== null) {
    newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.childLanes = newChildLanes;
  completedWork.subtreeFlags = subtreeFlags;
}
