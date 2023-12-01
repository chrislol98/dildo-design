import { isNumber } from '../../shared';
import { getSorterPriority, getSorterFn, getColumnByKey } from '../shared';
import cloneDeep from 'lodash/cloneDeep';
import * as React from 'react';

export default function useSorter(data, flattenColumns, childrenColumnName) {
  const [activeSorters, setActiveSorters] = React.useState(getDefaultSorters(flattenColumns));

  const getNextActiveSorters = React.useCallback(
    (sorter) => {
      // 不懂 未看 多列排序 降序
      const { field, direction } = sorter;
      if (activeSorters.find((item) => item.field === field)) {
        if (!direction) {
          return activeSorters.filter((item) => item.field !== field);
        }
        return activeSorters.map((item) => (item.field === field ? sorter : item));
      }
      // 单列排序
      if (!isNumber(sorter.priority) || activeSorters.find((item) => !isNumber(item.priority))) {
        return [sorter];
      }
      // 不懂 未看 多列排序 升序
      return [...activeSorters, sorter];
    },
    [activeSorters]
  );

  const onSort = (direction, field, _flattenColumns = flattenColumns) => {
    const column = getColumnByKey(_flattenColumns, field);
    const sorter = {
      direction,
      field,
      sorterFn: getSorterFn(column.sorter),
      priority: getSorterPriority(column.sorter),
    };
    const nextActiveSorters = getNextActiveSorters(sorter);
    // 不懂 重新setState，导致组件重新执行
    updateStateSorters(nextActiveSorters);
  };

  const updateStateSorters = React.useCallback(
    (nextActiveSorters) => {
      const controlledSorters = getControlledSorters(flattenColumns);
      if (!controlledSorters.length) {
        setActiveSorters(nextActiveSorters);
      }
    },
    [flattenColumns, getControlledSorters, setActiveSorters]
  );

  const processedData = getProcessedData(data, childrenColumnName, activeSorters);

  return [processedData, activeSorters, onSort];
}

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

const getControlledSorters = (flattenColumns) => {
  const controlledColumns = flattenColumns.filter((column) => 'sortOrder' in column);
  let sorters = [];
  controlledColumns.forEach((column) => {
    const priority = getSorterPriority(column.sorter);
    const direction = column.sortOrder;
    const sorter = {
      field: column.key,
      direction,
      sorterFn: getSorterFn(column.sorter),
      priority,
    };
    if (!direction) {
      sorters.push(sorter);
    } else if (isNumber(priority)) {
      if (sorters.every((item) => isNumber(item.priority) || !item.direction)) {
        sorters.push(sorter);
      }
    } else if (sorters.every((item) => !item.direction)) {
      sorters.push(sorter);
    } else {
      sorters = [sorter];
    }
  });
  return sorters;
};

function compareFn(activeSorters) {
  const compare = function (fn, direction) {
    return (a, b) => {
      const result = fn(a, b);
      return direction === 'descend' ? -result : result;
    };
  };

  const sorters = [...activeSorters];
  // 排序所有的sorter
  sorters.sort((a, b) => b.priority - a.priority);
  return (a, b) => {
    for (let i = 0, l = sorters.length; i < l; i++) {
      const { sorterFn, direction } = sorters[i];
      if (typeof sorterFn !== 'function') {
        continue;
      }
      const result = compare(sorterFn, direction)(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}

// 不懂 todo 用compose来解决参数不断增加的问题
function getProcessedData(data, childrenColumnName, activeSorters) {
  // 不懂 todo 性能优化
  const _data = cloneDeep(data);
  return getSortedData(_data, childrenColumnName, activeSorters);
}

function getSortedData(data, childrenColumnName, activeSorters) {
  function getSortedDataImpl(data, childrenColumnName) {
    return data.sort(compareFn(activeSorters)).map((item) => {
      if (Array.isArray(item[childrenColumnName])) {
        return {
          ...item,
          [childrenColumnName]: getSortedDataImpl(item[childrenColumnName], childrenColumnName),
        };
      } else {
        return item;
      }
    });
  }
  return getSortedDataImpl(data, childrenColumnName);
}
