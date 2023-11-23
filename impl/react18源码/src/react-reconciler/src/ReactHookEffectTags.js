export const NoFlags = 0b0000;
//effect.tags
export const HasEffect = 0b0001;//1
// effect.tags
//useLayoutEffect  积极的，会在UI绘制前之前，类似于微任务
export const Layout = 0b0100;//4
//effect.tags
//useEffect 消极的，会在UI绘制后执行，类似于宏任务
export const Passive = 0b1000;//8