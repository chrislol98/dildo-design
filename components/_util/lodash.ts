import cloneDeepWith from 'lodash/cloneDeepWith';
import { isArray, isObject } from './is';

export function cloneDeep(value) {
  // 只有对象才执行拷贝，否则直接返回。 如果是 File，MouseEvent对象，都可以直接返回
  return cloneDeepWith(value, (val) => {
    if (!isObject(val) && !isArray(val)) {
      return val;
    }
  });
}
