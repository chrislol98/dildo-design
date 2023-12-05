import { useComponent } from './shared';
import * as React from 'react';
import { INTERNAL_EXPAND_KEY } from './shared';
import Th from './th';
const THead = (props) => {
  const {
    expandProps = {},
    components,
    groupColumns,
    onSort,
    onFilter,
    activeSorters,
    filters,
    expandedRowRender,
  } = props;
  const { ComponentThead, ComponentHeaderRow, getHeaderComponentOperations } =
    useComponent(components);
  const { columnTitle } = expandProps;
  const expandNode = expandedRowRender && <th>{columnTitle && <div>{columnTitle}</div>}</th>;
  const selectionNode = <div></div>;
  const headerOperations = getHeaderComponentOperations({ selectionNode, expandNode });
  const renderChildren = () => {
    return groupColumns.map((row, index) => {
      return (
        <ComponentHeaderRow key={index}>
          {row.map((column, colIndex) => {
            if (column.$$isOperation) {
              let node;
              if (column.title === INTERNAL_EXPAND_KEY) {
                node = headerOperations.find((o) => o.name === 'expandNode')?.node;
              }
              return React.cloneElement(node, {
                key: column.key,
                className: '',
                ...column,
                style: {
                  width: column.width,
                },
              });
            }
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
