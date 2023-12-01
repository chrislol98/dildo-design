import * as React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { getColumnByKey } from './index';
export default function useFilter(data, flattenColumns) {
  const currentFilters = getDefaultFilters(flattenColumns);
  const [filters, setFilters] = React.useState(currentFilters);

  const controlledFilter = React.useMemo(() => {
    // 允许 filteredValue 设置为 undefined 表示不筛选
    const flattenFilteredValueColumns = flattenColumns.filter(
      (column) => 'filteredValue' in column
    );
    const newFilters = {};
    // 受控的筛选，当columns中的筛选发生改变时，更新state
    if (flattenFilteredValueColumns.length) {
      flattenFilteredValueColumns.forEach((column, index) => {
        const innerDataIndex = column.key || column.dataIndex || index;
        if (innerDataIndex !== undefined) {
          newFilters[innerDataIndex] = column.filteredValue;
        }
      });
    }
    return newFilters;
  }, [flattenColumns]);

  // todo 把innerFilters改成filter代替
  const innerFilters = React.useMemo(() => {
    return Object.keys(controlledFilter).length ? controlledFilter : filters;
  }, [filters, controlledFilter]);

  function onFilter(column, filter) {
    const newFilters = {
      ...innerFilters,
      [column.dataIndex]: filter,
    };
    // 不懂 为什么需要merge
    const mergedFilters = {
      ...newFilters,
      ...controlledFilter,
    };
    if (Array.isArray(filter) && filter.length) {
      setFilters(mergedFilters);
      const newProcessedData = getProcessedData(data, flattenColumns, newFilters);
    } else if (Array.isArray(filter) && !filter.length) {
      // onHandleFilterReset(column);
    }
  }

  const processedData = getProcessedData(data, flattenColumns, innerFilters);

  return [processedData, innerFilters, onFilter];
}

// 不懂 todo 用compose来解决参数不断增加的问题
function getProcessedData(data, flattenColumns, innerFilters) {
  // 不懂 todo 性能优化
  const _data = cloneDeep(data);
  return getFilteredData(_data, flattenColumns, innerFilters);
}

function getFilteredData(data, flattenColumns, innerFilters) {
  Object.keys(innerFilters).forEach((field) => {
    if (innerFilters[field] && innerFilters[field].length) {
      const column = getColumnByKey(flattenColumns, field);
      if (column && typeof column.onFilter === 'function') {
        data = data.filter((row) => {
          return innerFilters[field].reduce((pre, cur) => pre || column.onFilter(cur, row), false);
        });
      }
    }
  });

  return data;
}

function getDefaultFilters(flattenColumns) {
  const currentFilters = {};
  flattenColumns.forEach((column) => {
    const innerDataIndex = column.key;
    if (column.defaultFilters) {
      currentFilters[innerDataIndex] = column.defaultFilters;
    }
    if (column.filteredValue) {
      currentFilters[innerDataIndex] = column.filteredValue;
    }
  });

  return currentFilters;
}
