import { isNumber } from '../../shared';
import { getSorterPriority, getSorterFn } from '../shared';
import * as React from 'react';
export default function useSorter(flattenColumns) {
  const [currentSorter, setCurrentSorter] = React.useState({});
  const [activeSorters, setActiveSorters] = React.useState(getDefaultSorters(flattenColumns));

  const getNextActiveSorters = React.useCallback(
    (sorter) => {
      const { field, direction } = sorter;
      if (activeSorters.find((item) => item.field === field)) {
        if (!direction) {
          return activeSorters.filter((item) => item.field !== field);
        }
        return activeSorters.map((item) => (item.field === field ? sorter : item));
      }

      if (!isNumber(sorter.priority) || activeSorters.find((item) => !isNumber(item.priority))) {
        return [sorter];
      }
      return [...activeSorters, sorter];
    },
    [activeSorters]
  );

  // const updateStateSorters = useCallback(
  //   (sorter: SorterInfo, nextActiveSorters: SorterInfo[]) => {
  //     const controlledSorters = getControlledSorters(flattenColumns);
  //     if (!controlledSorters.length) {
  //       setActiveSorters(nextActiveSorters);
  //       setCurrentSorter(sorter);
  //     }
  //   },
  //   [flattenColumns, getControlledSorters, setActiveSorters, setCurrentSorter]
  // );

  return [currentSorter, activeSorters, getNextActiveSorters];
}

/**
 *
 * @param flattenColumns
 * @returns{number}
 */
function getDefaultSorters(flattenColumns) {
  let defaultSorters = [];
  flattenColumns.forEach((column) => {
    const innerDataIndex = column.key;


    // 多列排序  只有column上有 defaultSortOrder 或者 sortOrder sorter才有用
    if ('defaultSortOrder' in column || 'sortOrder' in column) {
      const priority = getSorterPriority(column.sorter);
      const direction = 'sortOrder' in column ? column.sortOrder : column.defaultSortOrder;
      const sorter = {
        field: innerDataIndex,
        direction,
        sorterFn: getSorterFn(column.sorter),
        priority,
      };
      if (!direction) {
        defaultSorters.push(sorter);
      } else if (isNumber(priority)) {
        if (defaultSorters.every((item) => isNumber(item.priority) || !item.direction)) {
          defaultSorters.push(sorter);
        }
      } else if (defaultSorters.every((item) => !item.direction)) {
        defaultSorters.push(sorter);
      } else {
        defaultSorters = [sorter];
      }
    }
  });
  return defaultSorters;
}
