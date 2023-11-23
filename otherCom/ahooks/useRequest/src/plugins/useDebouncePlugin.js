import { useEffect, useRef } from 'react';

const useDebouncePlugin = (fetchInstance, { debounceWait }) => {
  const debouncedRef = useRef();
  useEffect(() => {
    if (debounceWait) {
      const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);
      debouncedRef.current = debounce(callback => callback(), debounceWait);
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          debouncedRef.current?.(() => originRunAsync(...args).then(resolve).catch(reject));
        });
      };
    }
  }, [debounceWait]);
  // 不懂，什么时候执行这个useDebouncePlugin的
  return {};
};
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => fn(...args), wait);
  }
}
export default useDebouncePlugin;