import {
  useComponent,
  INTERNAL_EXPAND_KEY,
  getOriginData,
  INTERNAL_SELECTION_KEY,
  getRowKey,
} from './shared';
import * as React from 'react';
import Td from './td';
import { isSyntheticEvent, isArray } from '../shared';
const Tr = (props, ref) => {
  const {
    columns,
    record,
    components,
    rowKey: _rowKey,
    index,
    shouldRowExpand,
    expandProps = {},
    expandedRowRender,
    selectedRowKeys,
    onCheck,
    rowSelection,
    onClickExpandBtn,
    indeterminateKeys,
    childrenColumnName,
    data,
    expandedRowKeys = [],
  } = props;
  const rowKey = getRowKey(record, _rowKey);
  const originRecord = getOriginData(record);
  const { ComponentBodyRow, ComponentTd, getBodyComponentOperations } = useComponent(components);
  const tdProps = { ...props };
  // selection /////////////////////////////////////////
  const checked = selectedRowKeys.indexOf(rowKey) > -1;
  const checkboxRef = React.useRef<HTMLInputElement | null>();
  const indeterminate = indeterminateKeys.indexOf(rowKey) > -1;

  React.useEffect(() => {
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const handleOnCheck = (e) => {
    let checked;
    if (isSyntheticEvent(e)) {
      checked = e.target.checked;
    }
    onCheck(checked, record);
  };
  function renderSelection() {
    const checkboxNode = (
      <input ref={checkboxRef} type="checkbox" checked={checked} onChange={handleOnCheck}></input>
    );
    if (rowSelection?.renderCell) {
      const { renderCell } = rowSelection;
      return renderCell(checkboxNode, checked, originRecord);
    }
    return <ComponentTd>{checkboxNode}</ComponentTd>;
  }
  const selectionNode = renderSelection();
  // selection /////////////////////////////////////////
  // expand ////////////////////////////////////////////
  const rowExpandable = shouldRowExpand(record, index);
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
  const bodyOperations = getBodyComponentOperations({ selectionNode, expandNode });

  // expand ////////////////////////////////////////////
  // tree data
  function isChildrenNotEmpty(record) {
    return expandProps.strictTreeData
      ? isArray(record[childrenColumnName]) && record[childrenColumnName].length
      : record[childrenColumnName] !== undefined;
  }

  function isDataHaveChildren() {
    return data.find((d) => isChildrenNotEmpty(d));
  }
  const haveTreeData = isDataHaveChildren() && !expandedRowRender;
  const recordHaveChildren = isChildrenNotEmpty(record);
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
              minWidth: col.width,
            },
          });
        }
        return (
          <Td
            {...tdProps}
            key={idx}
            column={col}
            index={idx}
            record={record}
            trIndex={index}
            haveTreeData={haveTreeData}
            recordHaveChildren={recordHaveChildren}
            renderExpandIcon={renderExpandIcon}
          ></Td>
        );
      })}
    </ComponentBodyRow>
  );
};

const forwardRefTr = React.forwardRef(Tr);

export default forwardRefTr;
