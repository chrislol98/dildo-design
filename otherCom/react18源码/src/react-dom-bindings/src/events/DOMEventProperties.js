import { registerTwoPhaseEvent } from './EventRegistry';
const simpleEventPluginEvents = ['click'];
export const topLevelEventsToReactNames = new Map();
// api 事件 registerSimpleEvent
function registerSimpleEvent(domEventName, reactName) {
  //cmt onClick在哪里可以取到 pendingProps 
  //cmt 最开始的props就是虚拟dom的props: react.createElement('div', props)
  //cmt 赋值给workInProgress.pendingProps
  //cmt const newProps = workInProgress.pendingProps;
  //cmt 在源码里 让真实DOM元素   updateFiberProps(domElement, props);
  //cmt const internalPropsKey = "__reactProps$" + randomKey;
  //cmt 真实DOM元素[internalPropsKey] = props; 从真实dom中props.onClick取到


  // 把原生事件名和处理函数的名字进行映射或者说绑定，click=>onClick
  topLevelEventsToReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);//'onClick' ['click']
}
export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i];//click
    const domEventName = eventName.toLowerCase();//click
    const capitalizeEvent = eventName[0].toUpperCase() + eventName.slice(1);// Click
    registerSimpleEvent(domEventName, `on${capitalizeEvent}`);//click,onClick
  }
}