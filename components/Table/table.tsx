import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import {
  useComponent,
  useSelection,
  useColumns,
  useSorter,
  useFilter,
  useExpand,
  getRowKey,
  usePagination,
} from './shared';
import { useMergeProps } from '../shared';

const defaultProps = {
  rowKey: 'key',
  childrenColumnName: 'children',
  indentSize: 16,
};

const Table = function (props, ref) {
  props = useMergeProps(props, defaultProps, {});
  const { components, data = [], childrenColumnName } = props;
  const { ComponentTable } = useComponent(components);
  const [groupColumns, flattenColumns] = useColumns(props);
  const [sortedData, activeSorters, onSort] = useSorter(data, flattenColumns, childrenColumnName);
  const [sortedFilteredData, filters, onFilter] = useFilter(sortedData, flattenColumns);
  const [pagedSortedFilteredData, paginationEle] = usePagination(sortedFilteredData, {
    props,
  });

  const {
    selectedRowKeys,
    indeterminateKeys,
    onCheckAll,
    onCheck,
    allSelectedRowKeys,
    flattenData,
  } = useSelection(props, pagedSortedFilteredData, sortedFilteredData);

  const [expandedRowKeys, onClickExpandBtn] = useExpand(props, flattenData);

  const renderChildren = () => {
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
          indeterminateKeys={indeterminateKeys}
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
    return (
      <div>
        {renderTable()}
        {paginationEle}
      </div>
    );
  };
  return renderChildren();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;
