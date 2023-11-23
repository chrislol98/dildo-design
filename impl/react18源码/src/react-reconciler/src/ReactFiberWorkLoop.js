import {
  scheduleCallback as Scheduler_scheduleCallback,
  shouldYield,
  ImmediatePriority as ImmediateSchedulerPriority,
  UserBlockingPriority as UserBlockingSchedulerPriority,
  NormalPriority as NormalSchedulerPriority,
  IdlePriority as IdleSchedulerPriority,
  cancelCallback as Scheduler_cancelCallback,
  now,
} from './scheduler';
import { createWorkInProgress } from './ReactFiber';
import { beginWork } from './ReactFiberBeginWork';
import { completeWork } from './ReactFiberCompleteWork';
import { NoFlags, MutationMask, Passive } from './ReactFiberFlags';
import {
  commitMutationEffectsOnFiber, //执行DOM操作
  commitPassiveUnmountEffects, //执行destroy
  commitPassiveMountEffects, //执行create
  commitLayoutEffects,
} from './ReactFiberCommitWork';
import { finishQueueingConcurrentUpdates } from './ReactFiberConcurrentUpdates';
import {
  NoLanes,
  markRootUpdated,
  getNextLanes,
  getHighestPriorityLane,
  SyncLane,
  includesBlockingLane,
  NoLane,
  markStarvedLanesAsExpired,
  includesExpiredLane,
  markRootFinished,
  NoTimestamp,
  mergeLanes,
} from './ReactFiberLane';
import {
  getCurrentUpdatePriority,
  lanesToEventPriority,
  DiscreteEventPriority,
  ContinuousEventPriority,
  DefaultEventPriority,
  IdleEventPriority,
  setCurrentUpdatePriority,
} from './ReactEventPriorities';
import { getCurrentEventPriority } from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import { scheduleSyncCallback, flushSyncCallbacks } from './ReactFiberSyncTaskQueue';

let workInProgress = null;
let workInProgressRoot = null; //正在构建中的根节点
let rootDoesHavePassiveEffect = false; //此根节点上有没有useEffect类似的副作用
let rootWithPendingPassiveEffects = null; //具有useEffect副作用的根节点 FiberRootNode,根fiber.stateNode
let workInProgressRootRenderLanes = NoLanes;

//构建fiber树正在进行中
const RootInProgress = 0;
//构建fiber树已经完成
const RootCompleted = 5;
//当渲染工作结束的时候当前的fiber树处于什么状态,默认进行中
let workInProgressRootExitStatus = RootInProgress;
//保存当前的事件发生的时间
let currentEventTime = NoTimestamp;

/**
 * 计划更新root
 * 源码中此处有一个任务的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root, fiber, lane, eventTime) {
  markRootUpdated(root, lane);
  //确保调度执行root上的更新
  ensureRootIsScheduled(root, eventTime);
}
function ensureRootIsScheduled(root, currentTime) {
  //先获取当前根上执行任务
  const existingCallbackNode = root.callbackNode;
  //把所有饿死的赛道标记为过期
  markStarvedLanesAsExpired(root, currentTime);
  //不懂 获取当前优先级最高的车道
  const nextLanes = getNextLanes(root, workInProgressRootRenderLanes); //16
  //如果没有要执行的任务
  if (nextLanes === NoLanes) {
    return;
  }
  //不懂 获取新的调度优先级
  let newCallbackPriority = getHighestPriorityLane(nextLanes); //16
  //获取现在根上正在运行的优先级
  const existingCallbackPriority = root.callbackPriority;
  //如果新的优先级和老的优先级一样，则可以进行批量更新
  if (existingCallbackPriority === newCallbackPriority) {
    return;
  }
  if (existingCallbackNode !== null) {
    console.log('cancelCallback');
    Scheduler_cancelCallback(existingCallbackNode);
  }
  //新的回调任务
  let newCallbackNode = null;
  //如果新的优先级是同步的话
  if (newCallbackPriority === SyncLane) {
    //先把performSyncWorkOnRoot添回到同步队列中
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    //再把flushSyncCallbacks放入微任务
    queueMicrotask(flushSyncCallbacks);
    //如果是同步执行的话
    newCallbackNode = null;
  } else {
    //如果不是同步，就需要调度一个新的任务
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    newCallbackNode = Scheduler_scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
  }
  //在根节点的执行的任务是newCallbackNode
  root.callbackNode = newCallbackNode;
  root.callbackPriority = newCallbackPriority;
  /*  if (workInProgressRoot) return;
   workInProgressRoot = root;
   //告诉 浏览器要执行performConcurrentWorkOnRoot 在此触发更新
   scheduleCallback(NormalSchedulerPriority, performConcurrentWorkOnRoot.bind(null, root)); */
}
/**
 * 在根上执行同步工作
 */
function performSyncWorkOnRoot(root) {
  //获得最高优的lane
  const lanes = getNextLanes(root);
  //渲染新的fiber树
  // api render阶段 renderRootSync 创建新fiber树，标记副作用
  renderRootSync(root, lanes);
  //获取新渲染完成的fiber根节点

  // api commitRoot 更新真实的dom，之后把current节点指向新的fiber树
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  // cmt 执行副作用，修改真实Dom
  // cmt 插入真实dom树，修改root.current指向新fiber树
  commitRoot(root);
  return null;
}
/**
 * 根据fiber构建fiber树,要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
// api performConcurrentWorkOnRoot 构建fiber树
function performConcurrentWorkOnRoot(root, didTimeout) {
  //先获取当前根节点上的任务
  const originalCallbackNode = root.callbackNode;
  //获取当前优先级最高的车道
  const lanes = getNextLanes(root, NoLanes); //16
  if (lanes === NoLanes) {
    return null;
  }
  //如果不包含阻塞的车道，并且没有超时，就可以并行渲染,就是启用时间分片
  //所以说默认更新车道是同步的,不能启用时间分片
  //是否不包含阻塞车道
  const nonIncludesBlockingLane = !includesBlockingLane(root, lanes);
  //是否不包含过期的车道
  const nonIncludesExpiredLane = !includesExpiredLane(root, lanes);
  //时间片没有过期
  const nonTimeout = !didTimeout;
  //三个变量都是真，才能进行时间分片，也就是进行并发渲染，也就是可以中断执行
  const shouldTimeSlice = nonIncludesBlockingLane && nonIncludesExpiredLane && nonTimeout;
  // console.log('shouldTimeSlice', shouldTimeSlice);
  //执行渲染，得到退出的状态
  const exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);
  //如果不是渲染中的话，那说明肯定渲染完了
  if (exitStatus !== RootInProgress) {
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    commitRoot(root);
  }
  //说明任务没有完成
  if (root.callbackNode === originalCallbackNode) {
    //把此函数返回，下次接着干
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}
function renderRootConcurrent(root, lanes) {
  //因为在构建fiber树的过程中，此方法会反复进入，会进入多次
  //只有在第一次进来的时候会创建新的fiber树，或者说新fiber
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    prepareFreshStack(root, lanes);
  }
  //在当前分配的时间片(5ms)内执行fiber树的构建或者说渲染，
  workLoopConcurrent();
  //如果 workInProgress不为null，说明fiber树的构建还没有完成
  if (workInProgress !== null) {
    return RootInProgress;
  }
  //如果workInProgress是null了说明渲染工作完全结束了
  return workInProgressRootExitStatus;
}

// 不懂 从叶子节点还是根节点开始执行effect的？
function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects;
    //执行卸载副作用，destroy
    commitPassiveUnmountEffects(root.current); // root.current根fiber
    //执行挂载副作用 create
    commitPassiveMountEffects(root, root.current);
  }
}
function commitRoot(root) {
  const previousUpdatePriority = getCurrentUpdatePriority();
  try {
    //把当前的更新优先级设置为1
    setCurrentUpdatePriority(DiscreteEventPriority);
    commitRootImpl(root);
  } finally {
    setCurrentUpdatePriority(previousUpdatePriority);
  }
}
function commitRootImpl(root) {
  // api commitRoot finishedWork 新的构建好的fiber树的根fiber tag=3
  const { finishedWork } = root;
  console.log('commit', finishedWork.child.memoizedState.memoizedState[0]);
  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;
  root.callbackNode = null;
  root.callbackPriority = NoLane;
  //合并统计当前新的根上剩下的车道
  const remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root, remainingLanes);
  if ((finishedWork.subtreeFlags & Passive) !== NoFlags || (finishedWork.flags & Passive) !== NoFlags) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      // api commitRoot flushPassiveEffect useEffect就是在这里创建宏任务执行的
      Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
    }
  }
  //判断子树有没有副作用
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  //如果自己的副作用或者子节点有副作用就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    // api commitWork  commitMutationEffectsOnFiber 当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
    // api commitWork commitLayoutEffects 执行layout Effect
    commitLayoutEffects(finishedWork, root);
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      // api commitWork rootWithPendingPassiveEffects
      rootWithPendingPassiveEffects = root;
    }
  }
  //等DOM变更后，就可以把让root的current指向新的fiber树
  root.current = finishedWork;
  //在提交之后，因为根上可能会有跳过的更新，所以需要重新再次调度
  ensureRootIsScheduled(root, now());
}

// api prepareFreshStack
function prepareFreshStack(root, renderLanes) {
  // cmt 复用老fiber树，双缓存
  // xzc 核心 在这里的作用是创建新的根Fiber，在别的地方的作用是创建fiber子节点
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRootRenderLanes = renderLanes;
  workInProgressRoot = root;
  // api hook finishQueueingConcurrentUpdates
  finishQueueingConcurrentUpdates();
}
// * xzc
function renderRootSync(root, renderLanes) {
  //如果新的根和老的根不一样，或者新的渲染优先级和老的渲染优先级不一样
  if (root !== workInProgressRoot || workInProgressRootRenderLanes !== renderLanes) {
    prepareFreshStack(root, renderLanes);
  }
  workLoopSync();
  return RootCompleted;
}
function workLoopConcurrent() {
  //如果有下一个要构建的fiber并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    //console.log('shouldYield()', shouldYield(), workInProgress);
    sleep(5);
    performUnitOfWork(workInProgress);
  }
}
function workLoopSync() {
  while (workInProgress !== null) {
    // api performUnitOfWork
    performUnitOfWork(workInProgress);
  }
}
/**
 * 执行一个工作单元
 * @param {*} unitOfWork
 */

function performUnitOfWork(unitOfWork) {
  //获取新的fiber对应的老fiber
  const current = unitOfWork.alternate;

  // api beginWork
  // xzc 核心 1. 就是用老的子fiber链表和新的虚拟DOM进行比较，来创建新的fiber * 子单 * 链表的过程
  // xzc 2.返回子fiber
  // xzc 3. 标记 flags副作用，目前已知 placement
  // 不懂 3. 处理update ???
  const next = beginWork(current, unitOfWork, workInProgressRootRenderLanes);
  // 不懂 unitOfWork.memoizedProps = unitOfWork.pendingProps;
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    //如果没有子节点表示当前的fiber已经完成了
    completeUnitOfWork(unitOfWork);
  } else {
    //如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // api completeWork
    // xzc 执行此fiber 的完成工作,如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork);
    // xzc 核心 如果有弟弟，就构建弟弟对应的fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // cmt 如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    // cmt 也就是说一个父fiber,所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
  //如果走到了这里，说明整个fiber树全部构建完毕,把构建状态设置为空成
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}

// api lane requestUpdateLane
export function requestUpdateLane() {
  const updateLane = getCurrentUpdatePriority();
  if (updateLane !== NoLanes) {
    return updateLane;
  }
  const eventLane = getCurrentEventPriority();
  return eventLane;
}
function sleep(duration) {
  const timeStamp = new Date().getTime();
  const endTime = timeStamp + duration;
  while (true) {
    if (new Date().getTime() > endTime) {
      return;
    }
  }
}
//请求当前的时间
export function requestEventTime() {
  currentEventTime = now();
  return currentEventTime; //performance.now()
}
