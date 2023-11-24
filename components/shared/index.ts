import { useEffect, useRef } from 'react';
// hooks //////////////////////////////////////////////////////////////////////
export default function depsAreSame(oldDeps, deps) {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

export const useMount = (fn) => {
  useEffect(() => {
    fn?.();
  }, []);
};

export function useCreation(factory, deps) {
  const { current } = useRef({
    deps,
    obj: undefined,
    initialized: false,
  });
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj;
}
export function useCallOnce(fn) {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current === false) {
    fn();
    hasBeenCalled.current = true;
  }
}
// utils //////////////////////////////////////////////////////////////////////

// 如果没有回调，给函数最后一个参数加一个回调函数，返回promise
export function promisify<T = any>(fn: (...args: any[]) => any): () => Promise<T> {
  return Object.defineProperty(
    function (...args: any[]) {
      if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
      else {
        return new Promise((resolve, reject) => {
          args[args.length] = (err, res) => {
            if (err) return reject(new Error(err));
            resolve(res);
          };
          args.length++;
          fn.apply(this, args);
        });
      }
    },
    'name',
    { value: fn.name }
  );
}

// is //////////////////////////////////////////////////////////////////////

export function isSyntheticEvent(e: any): boolean {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
