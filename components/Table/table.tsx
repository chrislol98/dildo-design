import * as React from 'react';
const Table = function (props, ref) {
  const renderTable = () => {
    return <div></div>;
  };

  const renderHead = () => {};
  const renderBody = () => {};
  return renderTable();
};

const ForwardRefTable = React.forwardRef(Table);

export default ForwardRefTable;
