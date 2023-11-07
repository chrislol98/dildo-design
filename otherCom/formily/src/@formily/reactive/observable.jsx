import * as annotations from './annotations';
import { MakeObservableSymbol } from './environment';
import { createObservable } from './internals';
export function observable(target) {
  return createObservable(null, null, target);
}
observable.shallow = annotations.shallow;
observable[MakeObservableSymbol] = annotations.observable;
