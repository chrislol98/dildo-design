import { PropertyPath } from 'lodash';
import cloneDeepWith from 'lodash/cloneDeepWith';
import lodashSet from 'lodash/set';
import { isArray, isObject } from './is';

export function cloneDeep(value) {
  // 只有对象才执行拷贝，否则直接返回。 如果是 File，MouseEvent对象，都可以直接返回
  return cloneDeepWith(value, (val) => {
    if (!isObject(val) && !isArray(val)) {
      return val;
    }
  });
}

export function set<T extends Record<PropertyKey, any>>(
  target: T,
  // 不懂 PropertyPath是什么
  field: PropertyPath,
  value: any
) {
  lodashSet(target, field, cloneDeep(value));
  return target;
}
