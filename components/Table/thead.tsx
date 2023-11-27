import { useComponent } from './shared';
import * as React from 'react';
import Th from './th';
const THead = (props) => {
  // value
  const { components, groupColumns } = props;
  // hooks
  const { ComponentThead, ComponentHeaderRow, getHeaderComponentOperations } =
    useComponent(components);

  // setup

  // render

  const renderChildren = () => {
    return groupColumns.map((row, index) => {
      return (
        <ComponentHeaderRow key={index}>
          {row.map((column, colIndex) => {
            return <Th key={column.key} column={column} index={colIndex}></Th>;
          })}
        </ComponentHeaderRow>
      );
    });
  };
  return <ComponentThead>{renderChildren()}</ComponentThead>;
};

export default THead;
