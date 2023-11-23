import { createAnnotation, createObservable } from '../internals';
import { bindTargetKeyWithCurrentReaction, runReactionsFromTargetKey } from '../reaction';
export const shallow = createAnnotation(({ target, key, value }) => {
  const store = {
    value: createObservable(target, key, target[key], true),
  };
  function get() {
    bindTargetKeyWithCurrentReaction({ target: target, key: key });
    return store.value;
  }

  function set(value) {
    value = createObservable(target, key, target[key], true);
    store.value = value;
    runReactionsFromTargetKey({ target, key });
  }
  if (target) {
    Object.defineProperty(target, key, {
      set,
      get,
      enumerable: true,
      configurable: false,
    });
    return target;
  }
  return store.value;
});
