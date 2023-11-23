// 关键词 pendingProps
// 搜索useFiber(child, element.props);
// 不懂 memoizedProps 暂时未知  // unitOfWork.memoizedProps = unitOfWork.pendingProps;
// 关键词 react核心 update (派发update)
// enqueueConcurrentClassUpdate(类组件更新element、hostFiberRoot更新state) enqueueConcurrentHookUpdate(hook) 两种update
// hooks                  dispatchReducerAction 创建update，scheduleUpdateOnFiber调度更新
// fiberRootNode,类组件   createUpdate 创建update, scheduleUpdateOnFiber调度更新
// 关键词 react核心 effect (派发effect)

// 关键词 updateQueue
// 原生fiber updatePayload ['flex', '1', 'id', 'xxx', 'color', 'blue']
// 函数fiber effect循环链表
// 根fiber/类组件fiber   update数组

// 关键词 flags 副作用，对fiber节点也就是工作单元标记副作用，然后操作真实dom的增删改查
// UPDATE completeWork 搜索 markUpdate 这个uppdate是修改真实dom的属性
// PLACEMENT
// PASSIVE 该函数组件用过useEffect
// 关键词 memoizedState 这个值就是update（函数组件的hook,类组件的setState）最后的得出的值，在组件上的值就是这个
// fiber
// fiberRootNode memoizedStates === div#root
// 类组件        未知
// 函数组件      memoizedStates === hooks单向链表
// 原生组件      未知
// hooks也有 memoizedStates 属性      memoizedStates === 几个hook函数
//   useEffect    effect
//   useReducer   initialState
// 关键词 stateNode
// 根节点 fiber FiberRoot
// class fiber class实例
// 原生  fiber dom节点
// 函数  fiber 未知
// 关键词 reconcile === 和diff有关
// 关键词 fiber.type ======> HostComponent (span div button) FunctionComponent (一个jsx函数，就是平时写的组件) HostRootFiber(暂时没看到，好像为空)
// 关键词 fiber.tag  ======> HostComponent HostRoot HostText FunctionComponent
// 关键词 dom-diff
// 标记副作用的算法，实际对dom节点增删改查是在commit阶段
// reconcileChildFibers
// 关键词 优先级

// case 'click': return DiscreteEventPriority;
// case 'drag': return ContinuousEventPriority;
// default:return DefaultEventPriority;

/////////////////////////////////////////////////////////////////////////////////////

// 不懂 为什么hooks不能条件生成？
// 不懂 初次挂载，函数fiber.memoizedState存了hooks单链表
// 不懂 第一次挂载，只有hostRootFiber的第一个子fiber有一个 PLACEMENT 的副作用，其他fiber都不走跟踪副作用的流程
// api 外部数据redux更新
// react自身更新其实就是派发action(setState(action),setReducer(action),内部调用reconcileFiberonroot重新协调)
// 所以redux更新react感知不到，需要subscribe(forceUpdate)派发一个动作触发react更新
// 不懂 react18，外部数据源redux更新，数据错误问题
// 不懂，每次更新都会重新创建fiber树，所有的函数组件都会重新执行，只不过多次的setState会被合并，合并的过程不太清楚？
// 不懂 副作用flags冒泡
// 不懂 为什么没有去掉 ChildDeletion的副作用
// 不懂 为什么要在初次挂载的时候，在completeWork阶段插入子dom,而不是标记副作用在commitWork阶段
// 不懂 关键词 重复渲染怎么办？
// 不懂 根据源码，所有函数组件都会执行，怎么只让一部分执行
// 不懂 为什么不能在条件语句写 hook updateWorkInProgressHook mountWorkInProgressHook
// 不懂 子组件的 effect 先执行还是父组件 recursivelyTraverseLayoutEffects
// 不懂 批量更新，增量渲染
// concurrentQueues 懒加载 缓存更新
// finishQueueingConcurrentUpdates 添加进真实队列
// performConcurrentWorkOnFiber 宏任务延迟更新，实现批量更新
// 不懂 useEffect 中调用 setState 的闭包问题
// 不懂 事件代理 子事件父事件谁先执行
// 不懂 update缓存后，在什么时候真的假如fiber的队列
// 不懂 import {a} from 'xxx' a = 2，引用会变吗
// 不懂 setState在onclick为什么能分配渲染，allowConcurrentByDefault

/////////////////////////////////////////////////////////////////////////////////////

// api render阶段
// api commit阶段
// commitBeforeMutationEffects(dom变更前) commitMutationEffects(dom变更) commitHookLayoutEffects(dom变更后)

////////////////////////////////////////////////////////////////////////////////////

// api 视频回看 看面试题 回看视频找答案
// useEffect依赖，空数组

// 重写
// 不懂 批量更新  if (existingCallbackPriority === newCallbackPriority) {
// 不懂 高优先级打断低优先级 Scheduler_cancelCallback(existingCallbackNode);
// 不懂 cancelCallback
// 不懂 flushSync什么意思
// 不懂
// useState()
// useState()
// useState()
// 在更新的时候，useState的updateReducer会执行三次吗？
// 不懂 已经过期 不能打断
// if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
// 不懂 hook 条件语句 mountWorkInProgressHook
// 不懂 markRef commitAttachRef
// 不懂 冒泡副作用 bubbleProperties
// 不懂 宏任务 微任务
// React.useEffect(() => {
//   timer = setInterval(() => {
//     divRef.current.click();//1
//     if (counter++ === 0) {
//       setNumbers(updateB)//16
//     }
//     divRef.current.click();//1
//     if (counter++ > 100) {
//       clearInterval(timer);
//     }
//   });
// }, []);
// 不懂 是否不包含过期的车道
// const nonIncludesExpiredLane = !includesExpiredLane(root, lanes);
// 不懂 commitRootImpl
