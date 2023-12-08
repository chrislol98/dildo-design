import { useMemo } from 'react';

export function useDefaultProps<T>(originalProps: T, defaultProps: Record<PropertyKey, any>): T {
  return useMemo<T>(() => {
    const props = Object.assign({}, originalProps);
    Object.keys(defaultProps).forEach((key) => {
      if (props[key] === undefined) {
        props[key] = defaultProps[key];
      }
    });
    return props;
  }, [originalProps, defaultProps]);
}
