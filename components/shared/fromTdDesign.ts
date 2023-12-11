import { useState, useMemo } from 'react';
import upperFirst from 'lodash/upperFirst';
export function useDefaultProps<T>(originalProps: T, defaultProps: Record<PropertyKey, any>): T {
  return useMemo<T>(() => {
    // eslint-disable-next-line
    const props = Object.assign({}, originalProps);
    Object.keys(defaultProps).forEach((key) => {
      // https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js#L328-L330
      if (props[key] === undefined) {
        props[key] = defaultProps[key];
      }
    });
    return props;
  }, [originalProps, defaultProps]);
}

export interface ChangeHandler<T, P extends any[]> {
  (value: T, ...args: P);
}

type DefaultOptions<T extends string> = `default${Capitalize<T>}`;

type ToString<T extends string | number | symbol> = T extends string ? T : `${Extract<T, number>}`;

export const useControlled: <P extends any[], R extends object, K extends keyof R>(
  props: R,
  valueKey: K,
  onChange: ChangeHandler<R[K], P>,
  defaultOptions?:
    | {
        [key in DefaultOptions<ToString<K>>]: R[K];
      }
    | object
) => [R[K], ChangeHandler<R[K], P>] = (
  props = {} as any,
  valueKey,
  onChange,
  defaultOptions = {}
) => {
  // 外部设置 props，说明希望受控
  const controlled = Reflect.has(props, valueKey);
  // 受控属性
  const value = props[valueKey];
  // 约定受控属性的非受控 key 为 defaultXxx，某些条件下要在运行时确定 defaultXxx 则通过 defaultOptions 来覆盖
  const defaultValue =
    defaultOptions[`default${upperFirst(valueKey as string)}`] ||
    props[`default${upperFirst(valueKey as string)}`];

  // 无论是否受控，都要维护一个内部变量，默认值由 defaultValue 控制
  const [internalValue, setInternalValue] = useState(defaultValue);

  // 受控模式
  if (controlled) return [value, onChange || noop];

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      setInternalValue(newValue);
      onChange?.(newValue, ...args);
    },
  ];
};

/** */
function noop() {
  return {};
}
// 获取 ref 中的 dom 元素
export function getRefDom(domRef: React.RefObject<any>) {
  if (domRef.current && typeof domRef.current === 'object' && 'currentElement' in domRef.current) {
    return domRef.current.currentElement;
  }
  return domRef.current;
}
