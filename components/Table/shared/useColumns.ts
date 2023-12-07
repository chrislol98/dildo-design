import * as React from 'react';
import { INTERNAL_EXPAND_KEY, INTERNAL_SELECTION_KEY } from './constant';
import useComponent from './useComponent';

export default function useColumns(props) {
  // value
  const {
    columns = [],
    childrenColumnName,
    expandedRowRender,
    expandProps = {},
    components,
    rowSelection,
  } = props;
  const shouldRenderExpandCol = !!expandedRowRender;
  const shouldRenderSelectionCol = rowSelection;
  const { width: expandColWidth } = expandProps;
  const { columnWidth: selectionColumnWidth } = rowSelection;
  // hooks
  const { getHeaderComponentOperations, getBodyComponentOperations } = useComponent(components);
  const headerOperations = React.useMemo(
    () =>
      getHeaderComponentOperations({
        selectionNode: shouldRenderSelectionCol ? 'holder_node' : '',
        expandNode: shouldRenderExpandCol ? 'holder_node' : '',
      }),
    [shouldRenderSelectionCol, shouldRenderExpandCol, getHeaderComponentOperations]
  );
  const bodyOperations = React.useMemo(
    () =>
      getBodyComponentOperations({
        selectionNode: shouldRenderSelectionCol ? 'holder_node' : '',
        expandNode: shouldRenderExpandCol ? 'holder_node' : '',
      }),
    [shouldRenderSelectionCol, shouldRenderExpandCol, getBodyComponentOperations]
  );
  const processColumns = React.useCallback(
    (rows, operations, index, rowSpan = undefined) => {
      const _rows = [];
      rows.forEach((row, idx) => {
        const _row = { ...row, key: row.dataIndex || idx };
        if (idx === 0) {
          _row.$$isFirstColumn = true;
        } else {
          _row.$$isFirstColumn = false;
        }
        _rows.push(_row);
      });
      const expandColumn = shouldRenderExpandCol && {
        key: INTERNAL_EXPAND_KEY,
        title: INTERNAL_EXPAND_KEY,
        width: expandColWidth,
        $$isOperation: true,
      };
      const selectionColumn = shouldRenderSelectionCol && {
        key: INTERNAL_SELECTION_KEY,
        title: INTERNAL_SELECTION_KEY,
        width: selectionColumnWidth,
        $$isOperation: true,
      };

      if (!index) {
        operations.forEach((operation, i) => {
          if (operation.node) {
            const columnIndex = headerOperations.filter((opt) => opt.node).length - i - 1;
            if (operation.name === 'expandNode') {
              _rows.unshift({
                ...expandColumn,
                $$columnIndex: columnIndex,
                rowSpan,
              });
            } else if (operation.name === 'selectionNode') {
              _rows.unshift({
                ...selectionColumn,
                $$columnIndex: columnIndex,
                rowSpan,
              });
            }
          }
        });
      }
      return _rows;
    },
    [shouldRenderExpandCol, expandColWidth]
  );

  const flattenColumns = React.useMemo(
    () => processColumns(getFlattenColumns(columns, childrenColumnName), bodyOperations, 0),
    [columns, childrenColumnName, bodyOperations]
  );

  const rowCount = React.useMemo(
    () => getAllHeaderRowsCount(columns, childrenColumnName),
    [columns, childrenColumnName]
  );

  const groupColumns = React.useMemo(() => {
    if (rowCount === 1) {
      const rows = columns.map((col, index) => {
        return {
          ...col,
        };
      });
      return [processColumns(rows, headerOperations, 0)];
    }

    let columnIndex = 0;
    const rows = [];
    const travel = (columns, current = 0) => {
      rows[current] = [];
      columns.forEach((col) => {
        // todo 修改对象的值，对象改不改变，不太清楚
        const shallowedCol = { ...col };
        if (shallowedCol[childrenColumnName]) {
          shallowedCol.colSpan = getFlattenColumns(
            shallowedCol[childrenColumnName],
            childrenColumnName
          ).length;
          shallowedCol.$$columnIndex = [columnIndex];
          rows[current].push(shallowedCol);
          travel(shallowedCol[childrenColumnName], current + 1);
          shallowedCol.$$columnIndex.push(columnIndex - 1);
        } else {
          shallowedCol.rowSpan = rowCount - current;
          shallowedCol.$$columnIndex = columnIndex++;
          rows[current].push(shallowedCol);
        }
      });
      rows[current] = processColumns(rows[current], headerOperations, current, rowCount - current);
    };
    travel(columns);
    return rows;
  }, [columns, childrenColumnName, rowCount, processColumns]);

  // return
  return [groupColumns, flattenColumns];
}

function getFlattenColumns(columns, childrenColumnName) {
  const rows = [];
  function travel(columns) {
    if (columns && columns.length > 0) {
      columns.forEach((column) => {
        if (!column[childrenColumnName]) {
          rows.push({ ...column });
        } else {
          travel(column[childrenColumnName]);
        }
      });
    }
  }
  travel(columns);

  return rows;
}

function getAllHeaderRowsCount(columns, childrenColumnName) {
  let length = 0;
  if (columns && columns.length > 0) {
    columns.forEach((column) => {
      const depth = getAllHeaderRowsCount(column[childrenColumnName], childrenColumnName) + 1;
      length = Math.max(depth, length);
    });
  }
  return length;
}
