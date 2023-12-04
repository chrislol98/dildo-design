import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './ReactFiber';
import { Placement, ChildDeletion } from './ReactFiberFlags';
import isArray from 'shared/isArray';
import { HostText } from './ReactWorkTags';
/**
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  // api beginWork/dom-diff/标记副作用 deleteChild
  // 插入数组
  // 标记副作用 ChildDeletion
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) return;
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      returnFiber.deletions.push(childToDelete);
    }
  }
  //删除从currentFirstChild之后所有的fiber节点, 包括currentFirstChild
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) return;
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }
  /**
   * // 初次挂载  直接创建fiber
   * // 更新     单节点dom-diff
   * @param {*} returnFiber 根fiber div#root对应的fiber
   * @param {*} currentFirstChild 老的FunctionComponent对应的fiber
   * @param {*} element 新的虚拟DOM对象
   * @returns 返回新的第一个子fiber
   */
  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    //新的虚拟DOM的key,也就是唯一标准
    const key = element.key; // null
    let child = currentFirstChild; //老的FunctionComponent对应的fiber
    while (child !== null) {
      //判断此老fiber对应的key和新的虚拟DOM对象的key是否一样 null===null
      if (child.key === key) {
        //判断老fiber对应的类型和新虚拟DOM元素对应的类型是否相同
        if (child.type === element.type) {
          // p div
          deleteRemainingChildren(returnFiber, child.sibling);
          //如果key一样，类型也一样，则认为此节点可以复用
          const existing = useFiber(child, element.props);
          existing.ref = element.ref;
          existing.return = returnFiber;
          return existing;
        } else {
          //如果找到一key一样老fiber,但是类型不一样，不能此老fiber,把剩下的全部删除
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    // api reconcile阶段 createFiberFromElement fiber的pendProps从这里面来的
    //因为我们现实的初次挂载，老节点currentFirstChild肯定是没有的，所以可以直接根据虚拟DOM创建新的Fiber节点
    const created = createFiberFromElement(element);
    created.ref = element.ref;
    created.return = returnFiber;
    return created;
  }
  /**
   * 设置副作用
   * @param {*} newFiber
   * @returns
   */
  // api placeSingleChild
  function placeSingleChild(newFiber) {
    //说明要添加副作用
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      //要在最后的提交阶段插入此节点  React渲染分成渲染(创建Fiber树)和提交(更新真实DOM)二个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  function createChild(returnFiber, newChild) {
    if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.ref = newChild.ref;
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }
  function placeChild(newFiber, lastPlacedIndex, newIdx) {
    //指定新的fiber在新的挂载索引
    newFiber.index = newIdx;
    //如果不需要跟踪副作用
    //  如果父fiber节点是初次挂载，shouldTrackSideEffects为false，不需要添加flags
    //  会在complete阶段把所有子节点添加到自己身上
    if (!shouldTrackSideEffects) {
      return lastPlacedIndex;
    }
    //获取它的老fiber
    const current = newFiber.alternate;
    //如果有，说明这是一个更新的节点，有老的真实DOM。
    if (current !== null) {
      const oldIndex = current.index;
      //如果找到的老fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动
      if (oldIndex < lastPlacedIndex) {
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        return oldIndex;
      }
    } else {
      //如果没有，说明这是一个新的节点，需要插入
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }
  function updateElement(returnFiber, current, element) {
    const elementType = element.type;
    if (current !== null) {
      //判断是否类型一样，则表示key和type都一样，可以复用老的fiber和真实DOM
      if (current.type === elementType) {
        const existing = useFiber(current, element.props);
        existing.ref = element.ref;
        existing.return = returnFiber;
        return existing;
      }
    }
    // 不复用
    const created = createFiberFromElement(element);
    created.ref = element.ref;
    created.return = returnFiber;
    return created;
  }
  function updateSlot(returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (newChild !== null && typeof newChild === 'object') {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          //如果key一样，进入更新元素的逻辑
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
          }
        }
        default:
          return null;
      }
    }
    return null;
  }
  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild != null) {
      //如果有key用key,如果没有key使用索引
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }
    return existingChildren;
  }
  function updateTextNode(returnFiber, current, textContent) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }
  function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
    if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild);
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          // 如果key有值取key，不然取index索引
          const matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
          return updateElement(returnFiber, matchedFiber, newChild);
        }
      }
    }
  }
  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null; //返回的第一个新儿子
    let previousNewFiber = null; //上一个的一个新的儿fiber
    let newIdx = 0; //用来遍历新的虚拟DOM的索引
    let oldFiber = currentFirstChild; //第一个老fiber
    let nextOldFiber = null; //下一个第fiber
    //上一个不需要移动的老节点的索引
    let lastPlacedIndex = 0;

    //////////////////////////第一次遍历///////////////////////////////
    // 新老节点 同步（每次移动相同的距离，1步） 移动1步，一直复用，知道不能复用老节点，退出第一轮循环
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // 未确定，oldFiber可能被复用，sibling指向可能会被修改
      // 所以先暂存下一个老fiber
      nextOldFiber = oldFiber.sibling;
      //试图更新或者试图复用老的fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
      if (newFiber === null) {
        break;
      }
      if (shouldTrackSideEffects) {
        // 没有成功复用
        //如果有老fiber,但是新的fiber并没有 ****成功复用**** 老fiber和老的真实DOM，那就删除老fiber,在提交阶段会删除真实DOM
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      //指定新fiber的位置
      // api beginWork/dom-diff placeChild
      // 标记移动或者是插入副作用
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      //如果previousNewFiber为null，说明这是第一个fiber
      if (previousNewFiber === null) {
        //这个newFiber就是大儿子
        resultingFirstChild = newFiber; //li(A).sibling=p(B).sibling=>li(C)
      } else {
        //否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber;
      }
      // 更新 previousNewFiber
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    ////////////////////////第二轮遍历///////////////////////////////////////
    // 两种情况 1.新长老短，插入新fiber 2.新短老长，删除旧fiber
    //新的虚拟DOM已经循环完毕，3=>2
    if (newIdx === newChildren.length) {
      //删除剩下的老fiber
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }
    if (oldFiber === null) {
      //如果老的 fiber已经没有了， 新的虚拟DOM还有，进入插入新节点的逻辑
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        if (newFiber === null) continue;
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        //如果previousNewFiber为null，说明这是第一个fiber
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber; //这个newFiber就是大儿子
        } else {
          //否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
          previousNewFiber.sibling = newFiber;
        }
        //让newFiber成为最后一个或者说上一个子fiber
        previousNewFiber = newFiber;
      }
    }

    //////////////////////////第三轮遍历////////////////////////////////////
    // key，type相同，复用并map.delete节点，判断要不要标记移动，移动就是dom移动到子dom的末尾（commitWork的时候）
    // 最后map中剩下的，标记删除（commitWork阶段用）
    // 不懂 lastPlacedIndex初始值是0不懂
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    //开始遍历剩下的虚拟DOM子节点
    for (; newIdx < newChildren.length; newIdx++) {
      // 从当前newIdx开始，遍历老fiber数组
      const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          // 找到要复用的老fiber,并且要跟踪副作用，把老fiber从map删掉
          if (newFiber.alternate !== null) {
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
          }
        }
        //指定新的fiber存放位置 ，并且给lastPlacedIndex赋值
        // 1. lastPlacedIndex < oldFiber.index
        // 2. lastPlacedIndex > lodFiber.index, 需要移动
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber; //这个newFiber就是大儿子
        } else {
          //否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
          previousNewFiber.sibling = newFiber;
        }
        //让newFiber成为最后一个或者说上一个子fiber
        previousNewFiber = newFiber;
      }
    }
    if (shouldTrackSideEffects) {
      //等全部处理完后，删除map中所有剩下的老fiber
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
    }
    return resultingFirstChild;
  }
  /**
   *
   * @param {*} returnFiber 新的父Fiber
   * @param {*} currentFirstChild 老fiber第一个子fiber   current一般来说指的是老
   * @param {*} newChild 新的子虚拟DOM  h1虚拟DOM
   */

  // cmt react源码中 current单词指的就是老的fiber节点，workInProgress指的是新的fiber节点
  // api dom-diff reconcileChildFibers
  // 就是用老的子fiber链表和新的虚拟DOM进行比较，来创建新的fiber子单链表的过程
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    //现在需要处理更新的逻辑了，处理dom diff

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          // api beginWork/dom-diff reconcileSingleElement
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
        default:
          break;
      }
    }
    //newChild [hello文本节点,span虚拟DOM元素]
    if (isArray(newChild)) {
      // api beginWork/dom-diff reconcileChildrenArray 多子节点dom-diff
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }
    return null;
  }


  // api beginWork/dom-diff核心  新虚拟节点__jsx() 和 老fiber子链表 对比创建新fiber子链表
  return reconcileChildFibers;
}


//有老父fiber更新的时候用这个
export const reconcileChildFibers = createChildReconciler(true);
//如果没有老父fiber,初次挂载的时候用这个
export const mountChildFibers = createChildReconciler(false);
