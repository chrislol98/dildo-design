
//离散事件优先级 click onchange
const DiscreteEventPriority = 1;//1
//连续事件的优先级 mousemove 
const ContinuousEventPriority = 4;//4
//默认事件车道
const DefaultEventPriority = 16;//16 
//空闲事件优先级 
const IdleEventPriority = 343434343;//
function isHigherEventPriority(eventPriority, lane) {
  return (eventPriority !== 0) && eventPriority < lane;
}
/**
 * 把lane转成事件优先级
 * lane 31
 * 事件优先级是4
 * 调度优先级5
 * @param {*} lanes 
 * @returns 
 */
function lanesToEventPriority(lane) {
  //如果
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;//1
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;//4
  }
  return DefaultEventPriority;//16
}
let r = lanesToEventPriority(8);
console.log(r);