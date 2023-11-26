export type Listener = (...args: any[]) => void;
export type Type = string | symbol;
export class EventEmitter {
  static defaultMaxListeners: number;
  emit(type: Type, ...args: any[]): void;
  on(type: Type, listener: Listener): this;
  addListener(type: Type, listener: Listener): this;
  once(type: Type, listener: Listener): this;
}
