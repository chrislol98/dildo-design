import { isArray, isUndefined, isNull } from '../../shared';
export { default as useComponent } from './useComponent';
export { default as useColumns } from './useColumns';
export { default as useSorter } from './useSorter';
export { default as useFilter } from './useFilter';
export { default as useExpand } from './useExpand';
export { default as useSelection } from './useSelection';
export * from './constant';
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

export function isChildrenNotEmpty(record, field: string) {
  return isArray(record[field]) && record[field].length;
}

export function getSelectedKeys(
  record,
  checked,
  checkedRowKeys = [],
  _indeterminateKeys = [],
  rowKey,
  childrenColumnName,
  checkConnected
) {
  const selectedRowKeys = new Set(checkedRowKeys);
  const indeterminateKeys = new Set(_indeterminateKeys);

  function loop(record) {
    if (checked) {
      selectedRowKeys.add(getRowKey(record, rowKey));
      indeterminateKeys.delete(getRowKey(record, rowKey));
    } else {
      selectedRowKeys.delete(getRowKey(record, rowKey));
    }
    if (isArray(record[childrenColumnName])) {
      record[childrenColumnName].forEach((child) => {
        loop(child);
      });
    }
  }

  if (!checkConnected) {
    if (checked) {
      selectedRowKeys.add(getRowKey(record, rowKey));
    } else {
      selectedRowKeys.delete(getRowKey(record, rowKey));
    }
  } else {
    loop(record);

    updateParent(record, selectedRowKeys, indeterminateKeys, getRowKey, childrenColumnName);
  }

  return {
    selectedRowKeys: [...selectedRowKeys],
    indeterminateKeys: [...indeterminateKeys],
  };
}

export function getSelectedKeysByData(
  flattenData,
  checkedKeys = [],
  rowKey,
  childrenColumnName: string,
  checkConnected: boolean
) {
  if (!checkConnected) {
    return {
      selectedRowKeys: checkedKeys,
      indeterminateKeys: [],
    };
  }
  const selectedRowKeys = new Set(checkedKeys);
  const indeterminateKeys = new Set([]);

  function loop(record) {
    selectedRowKeys.add(getRowKey(record, rowKey));
    indeterminateKeys.delete(getRowKey(record, rowKey));

    if (isArray(record[childrenColumnName])) {
      record[childrenColumnName].forEach((child) => {
        loop(child);
      });
    }
  }

  checkedKeys.forEach((key) => {
    const record = flattenData.find((d) => getRowKey(d, rowKey) === key);
    if (!isUndefined(record) && !isNull(record)) {
      loop(record);
      updateParent(record, selectedRowKeys, indeterminateKeys, rowKey, childrenColumnName);
    }
  });

  return {
    selectedRowKeys: [...selectedRowKeys],
    indeterminateKeys: [...indeterminateKeys],
  };
}

function updateParent(
  record,
  selectedKeys: Set<React.Key>,
  indeterminateKeys: Set<React.Key>,
  rowKey,
  childrenColumnName: string
) {
  if (record.__INTERNAL_PARENT) {
    const parentKey = getRowKey(record.__INTERNAL_PARENT, rowKey);
    if (isArray(record.__INTERNAL_PARENT[childrenColumnName])) {
      const total = record.__INTERNAL_PARENT[childrenColumnName].length;
      let len = 0;
      let flag = false;
      record.__INTERNAL_PARENT[childrenColumnName].forEach((c) => {
        if (selectedKeys.has(getRowKey(c, rowKey))) {
          len += 1;
        }
        if (indeterminateKeys.has(getRowKey(c, rowKey))) {
          indeterminateKeys.add(parentKey);
          flag = true;
        }
      });
      if (total === len) {
        selectedKeys.add(parentKey);
        indeterminateKeys.delete(parentKey);
      } else if (len > 0 && total > len) {
        selectedKeys.delete(parentKey);
        indeterminateKeys.add(parentKey);
      } else if (len === 0) {
        selectedKeys.delete(parentKey);
        if (!flag) {
          indeterminateKeys.delete(parentKey);
        }
      }
    }

    updateParent(
      record.__INTERNAL_PARENT,
      selectedKeys,
      indeterminateKeys,
      rowKey,
      childrenColumnName
    );
  }
}

export function unique(arr) {
  return [...new Set(arr)];
}

export const getRowKey = (record, rowKey) => {
  if (typeof rowKey === 'function') {
    return rowKey(getOriginData(record));
  }
  return record[rowKey];
};
