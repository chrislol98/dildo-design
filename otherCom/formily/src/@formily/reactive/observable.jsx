import { createObservable } from './internals';
export function observable(target) {
    return createObservable(null, null, target)
}