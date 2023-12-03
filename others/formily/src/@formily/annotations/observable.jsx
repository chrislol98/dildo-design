import { createAnnotation, createObservable } from '../internals'
import { bindTargetKeyWithCurrentReaction, runReactionsFromTargetKey } from '../reaction';
export const observable = createAnnotation(
    ({ target, key, value }) => {
        const store = {
            value: createObservable(target, key, target[key]),
        }
        function get() {
            bindTargetKeyWithCurrentReaction({ target, key })
            return store.value
        }
        function set(value) {
            value = createObservable(target, key, value)
            store.value = value
            runReactionsFromTargetKey({ target, key })
        }
        Object.defineProperty(target, key, {
            set,
            get,
            enumerable: true,
            configurable: false
        })
        return store.value
    }
)