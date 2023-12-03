import { useRef } from 'react';
// useState替代品
// 不需要依赖性
// 防止出现闭包，未知
// 未知： useState好像有一些优化，将useLatest全部换成useLatest有待考究
function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export default useLatest;