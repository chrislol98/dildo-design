import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import { useComponent, useColumns, useSorter, useFilter, useExpand } from './shared';
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
  const [sortedAndFilteredData, filters, onFilter] = useFilter(sortedData, flattenColumns);
  const [expandedRowKeys, onClickExpandBtn] = useExpand(props, sortedAndFilteredData, getRowKey);
  const progressedData = getPageData(sortedAndFilteredData);

  const renderThead = () => {
    const thead = (
      <THead
        {...props}
        data={progressedData}
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
        data={progressedData}
        expandedRowKeys={expandedRowKeys}
        columns={flattenColumns}
        getRowKey={getRowKey}
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
