import { useComponent, INTERNAL_EXPAND_KEY } from './shared';
import * as React from 'react';
import Td from './td';
const Tr = (props, ref) => {
  const {
    columns,
    record,
    components,
    rowKey,
    index,
    isRowExpandable,
    expandedRowRender,
    expandProps = {},
    onClickExpandBtn,
    expandedRowKeys = [],
  } = props;
  const rowExpandable = isRowExpandable(record, index);
  const renderExpandIcon = (record, rowKey) => {
    // todo ~什么意思
    const expanded = !!~expandedRowKeys.indexOf(rowKey);
    const props = {
      onClick: (e) => {
        e.stopPropagation();
        onClickExpandBtn(rowKey);
      },
    };

    return (
      <button {...props} type="button">
        {expanded ? '-' : '+'}
      </button>
    );
  };
  const { ComponentBodyRow, ComponentTd, getBodyComponentOperations } = useComponent(components);
  const expandNode = expandedRowRender && (
    <ComponentTd>{rowExpandable && renderExpandIcon(record, rowKey)}</ComponentTd>
  );
  const selectionNode = <div></div>;
  const bodyOperations = getBodyComponentOperations({ selectionNode, expandNode });
  return (
    <ComponentBodyRow ref={ref}>
      {columns.map((col, idx) => {
        if (col.$$isOperation) {
          let node;
          if (col.title === INTERNAL_EXPAND_KEY) {
            node = bodyOperations.find((o) => o.name === 'expandNode')?.node;
          }
          return React.cloneElement(node, {
            key: col.key,
            className: '',
            style: {
              width: col.width,
            },
          });
        }
        return <Td key={idx} column={col} index={idx} record={record} trIndex={index}></Td>;
      })}
    </ComponentBodyRow>
  );
};

const forwardRefTr = React.forwardRef(Tr);

export default forwardRefTr;
