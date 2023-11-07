import { MakeObservableSymbol, ProxyRaw } from './environment';
export const isObservable = (target) => {
  return ProxyRaw.has(target);
};
export const isAnnotation = (target) => {
  return target && target[MakeObservableSymbol];
};
