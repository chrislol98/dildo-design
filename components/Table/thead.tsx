import { useComponent } from './shared';

import Th from './th';
const THead = (props) => {
  const { components, groupColumns, onSort, onFilter, activeSorters, filters } = props;
  const thProps = {
    ...props,
  };
  const { ComponentThead, ComponentHeaderRow } = useComponent(components);

  const renderChildren = () => {
    return groupColumns.map((row, index) => {
      return (
        <ComponentHeaderRow key={index}>
          {row.map((column, colIndex) => {
            return (
              <Th
                {...thProps}
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
