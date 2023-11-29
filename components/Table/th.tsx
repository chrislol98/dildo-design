import { useComponent } from './shared';
import * as React from 'react';
import Td from './td';
const Th = (props, ref) => {
  const {
    components,
    column: { colSpan, title },
    _key,
    onSort,
    sorter,
  } = props;
  const { ComponentTh, ComponentHeaderCell } = useComponent(components);
  const renderChildren = () => {
    return title;
  };

  const renderTh = () => {
    if (colSpan !== 0) {
      return (
        <ComponentTh>
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
