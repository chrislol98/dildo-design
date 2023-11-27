import * as React from 'react';
import TBody from './tbody';
import THead from './thead';
import ColGroup from './colgroup';
import { useComponent, useColumns } from './shared';

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

  // handleEffect
  // const props = useMergeProps(baseProps, defaultProps);

  // render
  const renderTable = () => {
    return (
      <>
        {renderThead()}
        {renderTBody()}
      </>
    );
  };
  const renderThead = () => {
    const thead = <THead {...props} data={pageData} groupColumns={groupColumns}></THead>;
    return (
      <ComponentHeaderWrapper>
        <ComponentTable ref={tHeadRef}>
          <ColGroup columns={flattenColumns} />
          {thead}
        </ComponentTable>
      </ComponentHeaderWrapper>
    );
  };
  const renderTBody = () => {
    const tbody = <TBody {...props} data={pageData} columns={flattenColumns} />;

    return (
      <ComponentBodyWrapper ref={tBodyRef}>
        <ComponentTable>
          <ColGroup columns={flattenColumns} />
          {tbody}
        </ComponentTable>
      </ComponentBodyWrapper>
    );
  };

  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;
