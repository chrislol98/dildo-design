import * as React from 'react';
import TBody from './tbody';
import ColGroup from './colgroup'
import { useComponent } from './shared';
const Table = function (props, ref) {
  
  // value
  const {components} = props;
  const {ComponentTable, ComponentBodyWrapper, ComponentHeaderWrapper} = useComponent(components);
  const TBodyNode = <TBody data={pageData} columns={flattenColumns} />;
  // const processedData = getProcessedData(currentSorter, activeSorters, innerFilters);
  // const pageData = getPageData();

  // xxxxxxxxxxx

  // render 
  const renderTable = () => {
    return <div></div>;
  };
  const renderTHead = () => {
    return  <ComponentHeaderWrapper >
    <ComponentTable>
      <ColGroup columns={flattenColumns}  />
      {theadNode}
    </ComponentTable>
  </ComponentHeaderWrapper>
  };
  const renderBody = () => {};
  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;

function getPageData() {}
