import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import cloneDeep from 'lodash/cloneDeep';
import ColGroup from './colgroup';
import { useComponent, useColumns, useSorter, getSorterPriority, getSorterFn } from './shared';
import { useMergeProps } from '../shared';

function compareFn(activeSorters) {
  const compare = function (fn, direction) {
    return (a, b) => {
      const result = fn(a, b);
      return direction === 'descend' ? -result : result;
    };
  };

  const sorters = [...activeSorters];
  // 根据 sorter.multiple字段排序，一个一个sorter比较，返回比较后的结果
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
function getProcessedData(data, childrenColumnName, currentSorter, activeSorters, filters) {
  // 不懂 todo 性能优化
  const _data = cloneDeep(data);

  if (
    (currentSorter.direction && typeof currentSorter.sorterFn === 'function') ||
    activeSorters.length
  ) {
    return getSortedData(_data, childrenColumnName, activeSorters);
  }
  return _data;
}

function getSortedData(data, childrenColumnName, activeSorters) {
  function getSortedDataImpl(data, childrenColumnName) {
    return data.sort(compareFn(activeSorters)).map((item) => {
      if (Array.isArray) {
        return {
          ...item,
          [childrenColumnName]: getSortedDataImpl(item[childrenColumnName], childrenColumnName),
        };
      }
    });
  }
  return getSortedDataImpl(data, childrenColumnName);
}

function getPageData(data) {
  return data;
}

const getColumnByKey = (flattenColumns, key) => {
  return flattenColumns.find((column) => column.key === key);
};

const defaultProps = {
  rowKey: 'key',
  childrenColumnName: 'children',
};

const Table = function (props, ref) {
  props = useMergeProps(props, defaultProps, {});
  const { components, data = [], columns = [], childrenColumnName } = props;
  const { ComponentTable } = useComponent(components);
  const processedData = getProcessedData(data, childrenColumnName, {}, {}, {});
  const pageData = getPageData(processedData);
  const [groupColumns, flattenColumns] = useColumns(props);

  /** ----------- Sorter ----------- */
  const [] = useSorter(flattenColumns);
  const onSort = (direction, field, _flattenColumns = flattenColumns) => {
    const column = getColumnByKey(_flattenColumns, field);
    const sorter = {
      direction,
      field,
      sorterFn: getSorterFn(column.sorter),
      priority: getSorterPriority(column.sorter),
    };
    // const nextActiveSorters = getNextActiveSorters(sorter);
    // updateStateSorters(sorter, nextActiveSorters);
    //// todo actually sorting
    // const newProcessedData = getProcessedData(sorter, nextActiveSorters, innerFilters);
    // const currentData = getPageData(newProcessedData);
  };

  /** ----------- Sorter end ----------- */

  // 不懂 todo 优化代码结构
  // usePagination();
  // useSort();
  // useFilter()

  const renderThead = () => {
    const thead = <THead {...props} data={pageData} groupColumns={groupColumns}></THead>;
    return thead;
  };
  const renderTBody = () => {
    const tbody = <TBody {...props} data={pageData} columns={flattenColumns} />;
    return tbody;
  };
  const renderTable = () => {
    return (
      <>
        <ComponentTable>
          <ColGroup columns={flattenColumns} />
          {renderThead()}
          {renderTBody()}
        </ComponentTable>
      </>
    );
  };
  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;
