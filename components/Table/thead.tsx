import { useComponent } from './shared';
import * as React from 'react';
import Th from './th';
const THead = (props) => {
  const { components, groupColumns, onSort, onFilter, activeSorters, filters } = props;
  const { ComponentThead, ComponentHeaderRow, getHeaderComponentOperations } =
    useComponent(components);

  const renderChildren = () => {
    return groupColumns.map((row, index) => {
      return (
        <ComponentHeaderRow key={index}>
          {row.map((column, colIndex) => {
            return (
              <Th
                key={column.key}
                _key={column.key}
                filter={filters[column.key]}
                sorter={activeSorters.find((item) => item.field === column.key)}
                column={column}
                index={colIndex}
                onSort={onSort}
                onFilter={onFilter}
              ></Th>
            );
          })}
        </ComponentHeaderRow>
      );
    });
  };
  return <ComponentThead>{renderChildren()}</ComponentThead>;
};

export default THead;
