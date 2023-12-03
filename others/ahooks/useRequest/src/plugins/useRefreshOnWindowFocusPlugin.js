// api 设计模式 订阅发布模式
import { useEffect, useRef } from 'react';
import useUnmount from '../../../useUnmount';
import limit from '../utils/limit';
import subscribeFocus from '../utils/subscribeFocus';

const useRefreshOnWindowFocusPlugin = (
  fetchInstance,
  { refreshOnWindowFocus, focusTimespan = 5000 }
) => {
  const unsubscribeRef = useRef();

  const stopSubscribe = () => {
    unsubscribeRef.current?.();
  };

  // 不懂 不加依赖性为什么会有问题？
  useEffect(() => {
    if (refreshOnWindowFocus) {
      const limitRefresh = limit(
        // 不懂 为什么要bind
        fetchInstance.refresh.bind(fetchInstance),
        focusTimespan
      );
      unsubscribeRef.current = subscribeFocus(() => limitRefresh());
    }
    return () => {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);
  useUnmount(() => {
    stopSubscribe();
  });
  return {};
};

export default useRefreshOnWindowFocusPlugin;
