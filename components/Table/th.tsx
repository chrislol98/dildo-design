import { useComponent, INTERNAL_EXPAND_KEY } from './shared';
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
    expandProps = {},
    filter,
    onFilter,
    expandedRowRender,
  } = props;
  const { columnTitle } = expandProps;

  const thProps: Record<PropertyKey, any> = { colSpan, rowSpan };
  const { ComponentTh, ComponentHeaderCell, getHeaderComponentOperations } =
    useComponent(components);
  const expandNode = expandedRowRender && <th>{columnTitle && <div>{columnTitle}</div>}</th>;
  const selectionNode = <div></div>;
  const headerOperations = getHeaderComponentOperations({ selectionNode, expandNode });
  const renderChildren = () => {
    return title;
  };

  const renderTh = () => {
    if (colSpan !== 0) {
      if (column.$$isOperation) {
        let node;
        if (column.title === INTERNAL_EXPAND_KEY) {
          node = headerOperations.find((o) => o.name === 'expandNode')?.node;
        }
        return React.cloneElement(node, {
          ...column,
          key: column.key,
          className: '',
          style: {
            width: column.width,
          },
        });
      }
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
