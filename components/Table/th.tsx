import { isSyntheticEvent } from '../shared';
import { useComponent, INTERNAL_EXPAND_KEY, INTERNAL_SELECTION_KEY } from './shared';
import * as React from 'react';

const Th = (props, ref) => {
  const {
    components,
    column: { colSpan, rowSpan, title },
    column,
    _key,
    onSort,
    sorter,
    data,
    expandProps = {},
    selectedRowKeys,
    allSelectedRowKeys = [],
    filter,
    onFilter,
    expandedRowRender,
    onCheckAll,
    rowSelection,
  } = props;

  const { columnTitle } = expandProps;
  const selectionRef = React.useRef<HTMLInputElement | null>();
  const thProps: Record<PropertyKey, any> = { colSpan, rowSpan };
  const { ComponentTh, ComponentHeaderCell, getHeaderComponentOperations } =
    useComponent(components);

  // 不懂 todo 别写在这个组件里面
  const currentSelectedRowKeys = React.useMemo(() => {
    const tempSet = new Set(allSelectedRowKeys);
    return selectedRowKeys.filter((v) => tempSet.has(v));
  }, [selectedRowKeys, allSelectedRowKeys]);

  function handleOnCheckAll(e) {
    let checked;
    if (isSyntheticEvent(e)) {
      checked = e.target.checked;
    }
    onCheckAll(checked);
  }
  // 不懂 todo 写到checkbox里面去
  React.useEffect(() => {
    console.log('is exec');
    if (column.title === INTERNAL_SELECTION_KEY) {
      selectionRef.current.indeterminate =
        data &&
        currentSelectedRowKeys.length > 0 &&
        currentSelectedRowKeys.length !== allSelectedRowKeys.length;
    }
  }, [selectionRef, data, currentSelectedRowKeys, allSelectedRowKeys]);
  const expandNode = expandedRowRender && <th>{columnTitle && <div>{columnTitle}</div>}</th>;
  const selectionNode = rowSelection && (
    <ComponentTh>
      <ComponentHeaderCell>
        <input
          ref={selectionRef}
          type="checkbox"
          checked={
            data &&
            currentSelectedRowKeys.length > 0 &&
            currentSelectedRowKeys.length === allSelectedRowKeys.length
          }
          disabled={!allSelectedRowKeys.length}
          onChange={handleOnCheckAll}
        ></input>
      </ComponentHeaderCell>
    </ComponentTh>
  );
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
        if (column.title === INTERNAL_SELECTION_KEY) {
          node = headerOperations.find((o) => o.name === 'selectionNode')?.node;
        }
        return React.cloneElement(node, {
          ...column,
          key: column.key,
          className: '',
          style: {
            width: column.width,
            minWidth: column.width,
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
