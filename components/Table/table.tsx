import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import { useComponent, useSelection, useColumns, useSorter, useFilter, useExpand } from './shared';
import { useMergeProps } from '../shared';

function getPageData(data) {
  return data;
}

const defaultProps = {
  rowKey: 'key',
  childrenColumnName: 'children',
};

const Table = function (props, ref) {
  props = useMergeProps(props, defaultProps, {});
  const { components, data = [], childrenColumnName, rowKey } = props;
  const getRowKey = React.useMemo(() => {
    if (typeof rowKey === 'function') {
      return (record) => rowKey(record);
    } else {
      return (record) => record[rowKey];
    }
  }, [rowKey]);
  const { ComponentTable } = useComponent(components);
  const [groupColumns, flattenColumns] = useColumns(props);
  const [sortedData, activeSorters, onSort] = useSorter(data, flattenColumns, childrenColumnName);
  const [sortedFilteredData, filters, onFilter] = useFilter(sortedData, flattenColumns);
  const pagedSortedFilteredData = getPageData(sortedFilteredData);
  const {
    selectedRowKeys,
    indeterminateKeys,
    onCheckAll,
    onCheck,
    setSelectedRowKeys,
    allSelectedRowKeys,
    flattenData,
  } = useSelection(props, pagedSortedFilteredData, sortedFilteredData, getRowKey);
  const [expandedRowKeys, onClickExpandBtn] = useExpand(props, flattenData, getRowKey);
  const renderThead = () => {
    const thead = (
      <THead
        {...props}
        getRowKey={getRowKey}
        onCheckAll={onCheckAll}
        data={pagedSortedFilteredData}
        allSelectedRowKeys={allSelectedRowKeys}
        selectedRowKeys={selectedRowKeys}
        groupColumns={groupColumns}
        onSort={onSort}
        onFilter={onFilter}
        filters={filters}
        activeSorters={activeSorters}
      ></THead>
    );
    return thead;
  };
  const renderTBody = () => {
    const tbody = (
      <TBody
        {...props}
        selectedRowKeys={selectedRowKeys}
        data={pagedSortedFilteredData}
        expandedRowKeys={expandedRowKeys}
        columns={flattenColumns}
        getRowKey={getRowKey}
        onCheck={onCheck}
        onClickExpandBtn={onClickExpandBtn}
      />
    );
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
