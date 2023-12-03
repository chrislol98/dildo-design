import { isObservable } from './externals';
import { createObservable } from './internals';
import { RawProxy } from './environment';
import {
  bindTargetKeyWithCurrentReaction,
  runReactionsFromTargetKey,
} from './reaction';
export const baseHandlers = {
  get(target, key) {
    const result = target[key];
    bindTargetKeyWithCurrentReaction({ target, key });
    const observableResult = RawProxy.get(result);
    if (observableResult) {
      return observableResult;
    }
    if (!isObservable(result)) {
      return createObservable(target, key, result);
    }
    return result;
  },
  set(target, key, value) {
    const newValue = createObservable(target, key, value);
    target[key] = newValue;
    runReactionsFromTargetKey({ target, key });
    return true;
  },
};


