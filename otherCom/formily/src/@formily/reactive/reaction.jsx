import { isFn } from './checkers'
import { ReactionStack, RawReactionsMap } from './environment'
const addRawReactionsMap = (target, key, reaction) => {
    const reactionsMap = RawReactionsMap.get(target)
    if (reactionsMap) {
        const reactionSet = reactionsMap.get(key)
        if (reactionSet) {
            reactionSet.add(reaction)
        } else {
            let reactionSet = new Set();
            reactionSet.add(reaction);
            reactionsMap.set(key, reactionSet);
        }
        return reactionsMap
    } else {
        let reactionSet = new Set();
        reactionSet.add(reaction);
        const reactionsMap = new Map([[key, reactionSet]])
        RawReactionsMap.set(target, reactionsMap)
        return reactionsMap
    }
}

export const bindTargetKeyWithCurrentReaction = (operation) => {
    let { key, target } = operation
    const current = ReactionStack[ReactionStack.length - 1]
    if (current) {
       addRawReactionsMap(target, key, current)
    }
}

export const runReactionsFromTargetKey = (operation) => {
    let { key, target } = operation
    runReactions(target, key)
}
const runReactions = (target, key) => {
    const reactions = getReactionsFromTargetKey(target, key)
    if(reactions){
        for (let reaction of reactions) {
            reaction();
        }
    }
}
const getReactionsFromTargetKey = (target, key) => {
    const reactionsMap = RawReactionsMap.get(target);
    if (reactionsMap) {
        return reactionsMap.get(key)
    }
}