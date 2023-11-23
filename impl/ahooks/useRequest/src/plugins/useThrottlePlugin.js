import { useEffect, useRef } from "react";
const useThrottlePlugin = (fetchInstance, { throttleWait }) => {
  const throttledRef = useRef();
  useEffect(() => {
    if (throttleWait) {
      const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);
      throttledRef.current = throttle((callback) => callback(), throttleWait);
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttledRef.current?.(() =>
            originRunAsync(...args)
              .then(resolve)
              .catch(reject)
          );
        });
      };
    }
  }, [throttleWait]);
  return {};
};
function throttle(fn, wait) {
  let lastExecTime = 0;
  const throttledFn = function (...args) {
    const currentTime = Date.now();
    const nextExecTime = lastExecTime + wait;
    if (currentTime >= nextExecTime) {
      fn.apply(this, args);
      lastExecTime = currentTime;
    }
  };
  return throttledFn;
}
export default useThrottlePlugin;
