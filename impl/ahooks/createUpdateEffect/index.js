import { useRef } from 'react';
// api createUpdateEffect 工厂模式
export const createUpdateEffect = hook => (effect, deps) => {
  const isMounted = useRef(false);
  hook(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};