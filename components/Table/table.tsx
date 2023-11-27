import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import { useComponent, useColumns } from './shared';
import { useMergeProps } from '../shared';
const defaultProps = {
  rowKey: 'key',
  childrenColumnName: 'children',
};

function getProcessedData(data, currentSorter, activeSorters, filters) {
  return data;
}

function getPageData(data) {
  return data;
}

const Table = function (props, ref) {
  // value
  const { components, data = [], columns = [] } = props;
  const { ComponentTable, ComponentBodyWrapper, ComponentHeaderWrapper } = useComponent(components);
  const tHeadRef = React.createRef();
  const tBodyRef = React.createRef();
  // 不懂 todo
  const processedData = getProcessedData(data, {}, {}, {});
  const pageData = getPageData(processedData);
  const [groupColumns, flattenColumns] = useColumns(props);
  // hooks
  props = useMergeProps(props, defaultProps, {});

  // logic
  // const props = useMergeProps(baseProps, defaultProps);

  // render
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
  const renderThead = () => {
    const thead = <THead {...props} data={pageData} groupColumns={groupColumns}></THead>;
    return thead;
  };
  const renderTBody = () => {
    const tbody = <TBody {...props} data={pageData} columns={flattenColumns} />;

    return tbody;
  };

  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;
