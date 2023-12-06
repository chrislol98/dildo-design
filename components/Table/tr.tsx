import { useComponent, INTERNAL_EXPAND_KEY, getOriginData, INTERNAL_SELECTION_KEY } from './shared';
import * as React from 'react';
import Td from './td';
import { isSyntheticEvent } from '../shared';
const Tr = (props, ref) => {
  const {
    columns,
    record,
    components,
    rowKey,
    index,
    isRowExpandable,
    expandedRowRender,
    selectedRowKeys,
    onCheck,
    rowSelection,
    expandProps = {},
    onClickExpandBtn,
    expandedRowKeys = [],
  } = props;
  const originRecord = getOriginData(record);
  const { ComponentBodyRow, ComponentTd, getBodyComponentOperations } = useComponent(components);

  // selection /////////////////////////////////////////
  const checked = selectedRowKeys.indexOf(rowKey) > -1;
  const handleOnCheck = (e) => {
    let checked;
    if (isSyntheticEvent(e)) {
      checked = e.target.checked;
    }
    onCheck(checked, record);
  };
  function renderSelection() {
    const checkboxNode = <input type="checkbox" checked={checked} onChange={handleOnCheck}></input>;
    if (rowSelection?.renderCell) {
      const { renderCell } = rowSelection;
      return <ComponentTd>{renderCell(checkboxNode, checked, originRecord)}</ComponentTd>;
    }
    return checkboxNode;
  }
  const selectionNode = renderSelection();
  // selection /////////////////////////////////////////
  // expand ////////////////////////////////////////////
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
  const expandNode = expandedRowRender && (
    <ComponentTd>{rowExpandable && renderExpandIcon(record, rowKey)}</ComponentTd>
  );
  // expand ////////////////////////////////////////////
  const bodyOperations = getBodyComponentOperations({ selectionNode, expandNode });

  return (
    <ComponentBodyRow ref={ref}>
      {columns.map((col, idx) => {
        if (col.$$isOperation) {
          let node;
          if (col.title === INTERNAL_SELECTION_KEY) {
            node = bodyOperations.find((o) => o.name === 'selectionNode')?.node;
          }
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
