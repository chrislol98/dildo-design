import { isPlainObj } from './checkers';
import { MakeObservableSymbol, ProxyRaw } from './environment';
export const isObservable = (target) => {
  return ProxyRaw.has(target);
};
export const isAnnotation = (target) => {
  return target && target[MakeObservableSymbol];
};
export const toJS = (values) => {
  const visited = new Set();
  const _toJS = (values) => {
    if (visited.has(values)) {
      return values;
    }
    if (isPlainObj(values)) {
      visited.add(values);
      const res = {};
      for (const key in values) {
        res[key] = _toJS(values[key]);
      }
      return res;
    }
    return values;
  };
  return _toJS(values);
};
