import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber, requestUpdateLane, requestEventTime } from "./ReactFiberWorkLoop";
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}
/**
 * 更新容器，把虚拟dom element变成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container DOM容器 FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
  //获取当前的根fiber
  const current = container.current;
  const eventTime = requestEventTime();
  //请求一个更新车道 16
  const lane = requestUpdateLane(current);
  //创建更新
  const update = createUpdate(lane);
  // xzc 更新虚拟dom
  // xzc 不同种类的fiber更新的payload不一样
  update.payload = { element }; //h1
  // cmt 1.把此更新对象添加到current这个根Fiber的更新队列上 2.返回根节点 FiberRootNode
  // cmt root = FiberRootNode
  const root = enqueueUpdate(current, update, lane);
  // cmt 调度更新 update
  scheduleUpdateOnFiber(root, current, lane, eventTime);
}
