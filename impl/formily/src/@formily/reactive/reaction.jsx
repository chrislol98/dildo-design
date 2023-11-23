import { RawReactionsMap, ReactionStack } from './environment';
/**
 * 把某个对象的某个key和当前的reaction进行绑定
 * @param {*} operation {target,key}
 */
export const bindTargetKeyWithCurrentReaction = (operation) => {
  const { target, key } = operation;
  //最后一个Reaction就是currentReaction
  const currentReaction = ReactionStack[ReactionStack.length - 1];
  if (currentReaction) {
    addRawReactionsMap(target, key, currentReaction);
  }
};
const addRawReactionsMap = (target, key, reaction) => {
  //判断此target对象在RawReactionsMap里有没有值
  const reactionsMap = RawReactionsMap.get(target);
  if (reactionsMap) {
    const reactionSet = reactionsMap.get(key);
    if (reactionSet) {
      reactionSet.add(reaction);
    } else {
      let reactionSet = new Set();
      reactionSet.add(reaction);
      reactionsMap.set(key, reactionSet);
    }
    return reactionsMap;
  } else {
    //ArraySet 元素唯1的数组
    let reactionSet = new Set(); //源码里作者自己封装了一个ArraySet
    reactionSet.add(reaction);
    const reactionsMap = new Map([[key, reactionSet]]);
    RawReactionsMap.set(target, reactionsMap);
    return reactionsMap;
  }
};

export const runReactionsFromTargetKey = (operation) => {
  const { target, key } = operation;
  runReactions(target, key);
};
function runReactions(target, key) {
  const reactions = getReactionsFromTargetKey(target, key);
  if (reactions) {
    for (let reaction of reactions) {
      if (isFn(reaction.scheduler)) {
        reaction.scheduler(reaction);
      } else {
        reaction();
      }
    }
  }
}
const getReactionsFromTargetKey = (target, key) => {
  const reactionsMap = RawReactionsMap.get(target);
  if (reactionsMap) {
    return reactionsMap.get(key);
  }
};
