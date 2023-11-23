import { useRef } from 'react';
const useLoadingDelayPlugin = (fetchInstance, { loadingDelay }) => {
  const timerRef = useRef();
  if (!loadingDelay) {
    return {};
  }
  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  return {
    onBefore: () => {
      cancelTimeout();
      timerRef.current = setTimeout(() => {
        fetchInstance.setState({
          loading: true
        });
      }, loadingDelay);
      return {
        loading: false
      };
    },
    onFinally: () => {
      cancelTimeout();
    },
    onCancel: () => {
      cancelTimeout();
    }
  };
};
export default useLoadingDelayPlugin;