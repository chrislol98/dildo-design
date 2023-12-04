import { isObject, isArray } from '../../shared';
export { default as useComponent } from './useComponent';
export { default as useColumns } from './useColumns';
export { default as useSorter } from './useSorter';
export { default as useFilter } from './useFilter';

export function getSorterPriority(sorter) {
  if (typeof sorter === 'object' && typeof sorter.multiple === 'number') {
    return sorter.multiple;
  }
}

export function getSorterFn(sorter) {
  if (typeof sorter === 'function') {
    return sorter;
  }
  if (typeof sorter === 'object' && typeof sorter.compare === 'function') {
    return sorter.compare;
  }
  return null;
}

export const getColumnByKey = (flattenColumns, key) => {
  return flattenColumns.find((column) => column.key === key);
};

// todo
export function getOriginData(data) {
  // if (isObject(data)) {
  //   return data.__ORIGIN_DATA;
  // }

  // if (!data || !isArray(data)) {
  //   return data;
  // }

  // return data.map((d) => {
  //   if (!isObject(d)) {
  //     return d;
  //   }
  //   return d.__ORIGIN_DATA;
  // });
  return data;
}
