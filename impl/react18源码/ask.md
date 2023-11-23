为啥叫自动的 自动就新的

这两者有什么不一样吗, 或者说是 automatic会带来一些优化 ???
以前需要你在代码中手动引入React,现在不需要你手工引入React

新的写法是17后的版本吗
为什么react转jsx换成automatic，比classic的优势是什么
👍👍👍
react自己就可以过滤特殊字符吗 可以的
老师看下package.json
jsx-dev-runtime和jsx- runtime有什么区别



节点生成是从里到外的？？
是的
代码commit下
深度优先
为什么要用hasOwnProperty判断一下 感觉没必要
有必要的，因为有可能此属性是原型 上的
没看到递归呀，儿子怎么转成react元素的？
这个递归是babel帮我们实现的



简单来说FiberRootNode = containerInfo,它的本质就是一个真实的容器DOM节点 div#root
其实就是一个真实的DOM



如果没有空闲执行任务， 还一定等到16.6ms才渲染下一帧吗？
下一个16.6
16.6m 是一帧的时间 不是等16.6
有无数个16.6ms 这个不行就下一个 下个不行就下下个
直到执行完
每一帧16.6ms，其中5ms左右的空闲时间。16.6ms是通过60Hz计算出来的，那5ms是通过什么算出来的？

5ms是一个平均值 
空闲任务没完成会放到下一针的的最开始吧
这种是基于线程还是进程
5ms是react定义的
5ms是大概不卡的默认值

React里面并没有使用requestIdleCallback, 
因为1.兼容性问题 2，执行时间不可控
React自己实现了一个类似requestIdleCallback,里面把每帧执行时间定为5ms

是看下一次有空余的一帧时间
都没有的话就到最后
为什么deadline.timeRemaining大于1
大于就是表示还有空闲时间
线程，js是跑在线程里的

单个任务执行过长 会被中断吗？
会？不会中断，一个任务就是执行的最小单位，不能打断
requestIdleCallback 支持性不是很好啊
react自己实现了一个requestIdleCallback
不中断
如果第一个任务还没执行完，第一帧就没剩余时间了。
那么这个任务就会中断，然后放到下一帧重新执行？

调度为合作式调度
是用户和浏览器双方的合作。

可以理解成就是按照执行的顺序前后联系上吗
这棵树只有刚开始会建立，后面都是透过删除，更新，新增 fiber node来改变这棵树 对吧?
是的
感觉这个树的访问是深度优先吗
是的
如果不能知道二儿子，为啥二儿子的return能指向父亲呢？

更新节点的时候会diff
可以通过大儿子知道二儿子


为什么父节点要标记子节点的flags?

为了性能优化

在更新的时候我要知道当前fiber节点的状态  是增加还是更新还是删除
双缓存技术是React中特有的吗？
具体用在哪


noflag 作用是什么 没听懂
noflag就是没用副作用的意思 就是没有任务操作

为什么要用二级制表示
子节点更新又不更新父节点，为什么还要给父节点标记为4
1
副作用是什么？
父亲没副作用 能确保孩子没副作用??
不能



父亲没副作用 能确保孩子没副作用?? 不能
孩子有副作用，自己一定有副作用？ 不一定



下次更新的时候 有更新删除增加操作 就算有副作用 是的
遍历tree的时后会搜集 effect
React18以前会收effect
React18.2删除了所有的effects
不再收集effect,


自己的副作用，和孩子的副作用，是两个独立的变、量标识
孩子副作用怎么递归上去的呢？
function bubbleProperties(completedWork) {}
儿子的副作用会向上冒泡给父亲




这个根节点已经创建虚拟dom了吗????
没有
根节点是非常特殊
正常来说
先有虚拟DOM->fiber节点->真实DOM
根节点 上开始React执行前就已经 建好了document.getElementById("root")


根fiber是不是比较特殊，没有对应的虚拟dom吗？是的


current指是当前根容器它的现在正在显示的或者说已经渲染好的fiber树
current代表当前节点对应的Fiber
current是有特殊含义的

fiber就是为了监听节点变化更新渲染的吗

fiber是一个数据结构
为什么需要有这样一个数据结构
因为我们希望把构建fiber树的过程，或者说渲染的过程变成可中断，可暂停和恢复的过程

jsx
渲染
类组件函数组件
合成事件
ref,DOM-DIFF
hooks
lane模型
并发渲染


老师刚才最后这里，剪短环形链表之后，这一个链表的所有更新都要执行么
update1=>update2=>update3
循环执行更新
以后还讲react 17吗？
以前讲的是17
这儿不是很明白，
hooks 双向链表会讲吗
肯定会
环形
fiber这里还继续往下写吗？ 张佬
布占华:fiber这里还继续往下写吗？ 张佬

下次课是下周三晚上8点开始



20:10
奈斯啊小刘超奈斯
fiberRootNode --->  只能是根元素#root么 是的
shine
对RootNode  就是 #root 
丁浩宇
fiber的作用是什么 

以前讲的是17
先有虚拟DOM=生成真实DOM
此生成过程是一气呵成，中间不能不断,如果工作过长可能会引起卡顿
有了fiber以后
虚拟DOM=>fiber=>生成真实DOM
fiber是一个链表，可以很方便的中断和重启
shine
拆分 任务。 



帅汤汤
应该是16之前吧 
shine
就是15 
冰可乐加冰
jsxdev生成虚拟dom只是vite调用的吗 
不是的，所有都会调
奈斯啊小刘超奈斯
跟vite没关系 
奋斗ing
https://claudiopro.github.io/react-fiber-vs-stack-demo/ 
奋斗ing
对比 
彭时宇
以前是直接递归渲染 




performUnitOfWork作用就是执行当前fiber,并返回下一个fiber? 
执行一个工作单元
beginWork是是执行当前fiber,并返回下一个fiber?


wind-zhou
怎么标识的B1 完成 
有两种情况完成一个fiber
1. 没有child,没有大儿子
2. 所有的儿子已经处理完了，父fiber也会完成

怎么完成的？回到父亲不会死循环吗 
回到父fiber之后，不会执行父fiber,而是会执行父fiber的弟弟
彭时宇
这就是深度优先 
奈斯啊小刘超奈斯
是的 深度优先 
sunShine
执行了completeUnitOfWork就是结束了 



哪里判断的都完成了 如果下一个fiber是null就全结束了
怪人。
儿子完了没弟弟了 
彭时宇
fiber.return为空也就完成了 
丁浩宇
fiber= fiber.return就说明完成饿了 
fiber为空 


bu
在更新过程中，其他高优先级的任务指什么？ 
并发渲染和优先级放在最后讲

桑祈
为什么是深度优先  不是广度优先 


1.虚拟DOM渲染
2.函数组件
3.useReducer useState
4.DOM-DIFF
5.任务调度
6.优先级lane和并发渲染



中途停止了，怎么可以接着在断开点开始渲染 
每次渲染以后都会记录下一个fiber
nextUnitOfWork

怪人。
while循环 
彭时宇
循环可以中断 
shine

yjg
有一个变量记录节点，下次就会从该变量的节点开始渲染  nextUnitOfWork
bu
前中后序遍历都是深度优先吗？ 


丁浩宇
什么事前序中续 
这是二叉树的遍历中的概念，指的是根节点是先遍历，还是中间遍历，还是最后遍历

孙景峰
横着来广，竖着来深 
shine
前 根左右  中 左根右  后  左右根 
奈斯啊小刘超奈斯
但是A1不是后完成的么 
赵正阳
Fiber非常像是二叉树后序遍历 


奈斯啊小刘超奈斯
pending指向最后就是源码这样写的没有特殊用意,还是因为什么
链表


帅汤汤
pending 意思就是直到…为止，表示这个列表到此为止 
悬而未决的;待定;待决;即将发生的
等待生效的更新队列


21:37
丁浩宇
跟容器 
sunShine
root 
胡超
根节点 
好大鸭
直接返回根节点不行吗 
高红翔
fiber没传把 


shine
老师 current和workInprogress的边界是什么？
假如我就调用一次setState ，也是一个workInprogress 吗 
workInprogress对就一个fiber了点
fiber节点组合在一起就是fiber 树

current也是一个fiber节点
代表老的fiber节点，也就是上一次的fiber节点

好大鸭
一个fiber树更新自己 
彭时宇
感觉这样轮替就不是连续更新了 
好大鸭
也差不多 
胡超
这两个fiber树是一个做展示，一个做渲染吗 
两个树
一个是对应页面上的真实DOM元素，代表当前已经渲染渲染完成fiber
一个是对应是正在构建 中的新的fiber树，表示还没有生效，没有更新到DOM上fiber村




轮替之后老的会更新吗 不会
bu
不完整会看着比较闪烁吗？ 是的
shine
老的就变成下一个新的 是的
好大鸭
第三次是在第一次基础上修改的  是的
好大鸭
如果第二次修改的很多 
彭时宇
轮替的过程会把老的放到缓存区吗 会的
shine
一直在内存中 
Wáng
轮播图无缝循环 
崔
是不是就相当于创建了一个真实dom，但并没有向页面中进行替换或插入，等绘制完成才替换
可能这么认为 
好大鸭
第三次创建fiber不会很慢吗 

彭时宇
再次轮替不就又会来了吗 
bu
对于第一次老版本， 再第二次显示的时候， 经过两次变动， diff的变更会多吧？ 



彭时宇
轮替两次是不是相当于没有轮替 
好大鸭
写个简单易懂的diff吧 
wind-zhou
轮替过程中肯定是会更新的，要不然就没有意义了 
22:14
孙景峰
直接深拷贝一个他不香吗 
shine
他只是复用对象，不需要管属性，diff的是current 产生更新 


可以clone吗





yjg
fiber commit阶段是不能被打断吧 
是同步的，不能打断
Bury
周三那个是win11的系统吗 那个ui还挺好看的 
一咻
主流程有图么 
我尽量后面全部有图


整数
updateQueue




北巷南猫
那要是newLastBaseUpdate有值有需要跳过的更新那么他和她后面的baseState都是同一个值
baseState是队列的属性，不是更新的属性 
北巷南猫
都是前面执行的state的值是吗 

 * 跟fiber放的是vdom,funcC放的是hooks, 同一个数组不会又有vdom和hooks是么? 
 * 把更新放在更新队列里
 * 根fiber的更新{payload:{element:<h1/>}}
 * 函数组件的更新
 * 函数组件fiber的memoizedState = hook链表头= updateQueue  {action:更新函数state=>state+'A'}



不同的对象有不同的更新队列，不同的更队有不同的更新对象


shine
老师那个不是子集的没想明白 0010和0001 那不是子集 0001就不执行还是？

更新4个  A1 B2 C1 D2
肯定先走优先级高的更新，渲染1
A1C1
baseState=A
baseQueue=B2C0D2
AC
再渲染优先级低的2
B2C0D2
BCD




yjg
是先执行优先级高的 
yjg
shine 那个地方不是赋值为0了,0是任何数的子集 





胡超
这个阻塞的车道有哪些啊？ 
胡超
输入车道有具体的说明嘛 
21:10
胡超
那不是一直是true了 
shine
更新完就设置回去了吧 
胡超
是的，应该是要改掉 
21:18
shine
这块有点复杂 
shine
下一帧继续 
21:26
shine
能 
shine
3次 
21:32
胡超
1 
shine
最后一次是在渲染啥？ 
shine
是useEffect的set吗 
张仁阳
休息5 
