import { useComponent } from './shared';
import * as React from 'react';
import Td from './td';
const Th = (props, ref) => {
  const {
    components,
    column: { colSpan, rowSpan, title },
    column,
    _key,
    onSort,
    sorter,
    filter,
    onFilter,
    filterDropdown,
    onFilterDropdownVisibleChange,
  } = props;
  const thProps: Record<PropertyKey, any> = { colSpan, rowSpan };
  console.log(thProps, 'thProps');
  const { ComponentTh, ComponentHeaderCell } = useComponent(components);
  const renderChildren = () => {
    return title;
  };

  const renderTh = () => {
    if (colSpan !== 0) {
      return (
        <ComponentTh {...thProps}>
          <ComponentHeaderCell>
            {renderChildren()}
            <span
              onClick={() => onSort('ascend', _key)}
              style={{ background: sorter?.direction === 'ascend' ? 'red' : '', cursor: 'pointer' }}
            >
              ⬆️
            </span>
            <span
              onClick={() => onSort('descend', _key)}
              style={{
                background: sorter?.direction === 'descend' ? 'red' : '',
                cursor: 'pointer',
              }}
            >
              ⬇️
            </span>
            <span onClick={() => onFilter(column, filter)}>过滤</span>
          </ComponentHeaderCell>
        </ComponentTh>
      );
    } else {
      return null;
    }
  };
  return renderTh();
};

export default Th;
