import * as React from 'react';
import TBody from './tbody';

const Table = function (props, ref) {
  // value
  const TBodyNode = <TBody data={pageData} columns={flattenColumns} />;
  // const processedData = getProcessedData(currentSorter, activeSorters, innerFilters);
  // const pageData = getPageData();

  // xxxxxxxxxxx

  // jsx
  const renderTable = () => {
    return <div></div>;
  };
  const renderHead = () => {};
  const renderBody = () => {};
  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;

function getPageData() {}
