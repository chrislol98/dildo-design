import { useMemo, useRef } from 'react';
// useCallback替代品
// 不同点：不需要依赖性
function useMemoizedFn(fn) {
  const fnRef = useRef(fn);
  fnRef.current = useMemo(() => fn, [fn]);
  const memoizedFn = useRef();
  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args);
    };
  }
  return memoizedFn.current;
}
export default useMemoizedFn;