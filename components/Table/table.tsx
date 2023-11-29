import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import { useComponent, useColumns, useSorter, getSorterPriority, getSorterFn } from './shared';
import { useMergeProps, useUpdate } from '../shared';

function getPageData(data) {
  return data;
}

const defaultProps = {
  rowKey: 'key',
  childrenColumnName: 'children',
};

const Table = function (props, ref) {
  props = useMergeProps(props, defaultProps, {});
  const { components, data = [], childrenColumnName } = props;
  const { ComponentTable } = useComponent(components);
  const [groupColumns, flattenColumns] = useColumns(props);
  const { processedData, onSort, activeSorters } = useSorter(
    flattenColumns,
    data,
    childrenColumnName
  );
  const pageData = getPageData(processedData);

  const renderThead = () => {
    const thead = (
      <THead
        {...props}
        data={pageData}
        groupColumns={groupColumns}
        onSort={onSort}
        activeSorters={activeSorters}
      ></THead>
    );
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
