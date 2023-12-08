import { useEffect, useRef } from 'react';
import * as React from 'react';
export * from './fromTdDesign';
/* -----------------hooks------------------ */
function depsAreSame(oldDeps, deps) {
  if (oldDeps === deps) return true;
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }
  return true;
}

export const useUpdate = () => {
  const [, setState] = React.useState({});
  return React.useCallback(() => setState({}), []);
};

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
export function useCreate(fn) {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current === false) {
    fn();
    hasBeenCalled.current = true;
  }
}

export type MergePropsOptions = {
  _ignorePropsFromGlobal?: boolean;
};

export function useMergeProps<PropsType>(
  componentProps: PropsType & MergePropsOptions,
  defaultProps: Partial<PropsType>,
  globalComponentConfig: Partial<PropsType>
): PropsType {
  const { _ignorePropsFromGlobal } = componentProps;
  const _defaultProps = React.useMemo(() => {
    return { ...defaultProps, ...(_ignorePropsFromGlobal ? {} : globalComponentConfig) };
  }, [defaultProps, globalComponentConfig, _ignorePropsFromGlobal]);

  const props = React.useMemo(() => {
    // Must remove property of MergePropsOptions before passing it to component
    const mProps = omit(componentProps, ['_ignorePropsFromGlobal']) as PropsType;

    // https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react/src/ReactElement.js#L312
    for (const propName in _defaultProps) {
      if (mProps[propName] === undefined) {
        mProps[propName] = _defaultProps[propName];
      }
    }

    return mProps;
  }, [componentProps, _defaultProps]);

  return props;
}

/* -----------------hooks end------------------ */

/* -----------------utils------------------ */
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

// delete keys from object
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: Array<K | string> // string 为了某些没有声明的属性被omit
): Omit<T, K> {
  const clone = {
    ...obj,
  };
  keys.forEach((key) => {
    if ((key as K) in clone) {
      delete clone[key as K];
    }
  });
  return clone;
}
/* -----------------utils end------------------ */

/* -----------------is------------------ */
const opt = Object.prototype.toString;

export function isSyntheticEvent(e: any): boolean {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return opt.call(obj) === '[object Object]';
}

export function isNumber(obj: any): obj is number {
  return opt.call(obj) === '[object Number]' && obj === obj;
}

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === '[object Array]';
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}
/* -----------------is end------------------ */
