import * as React from 'react';

export default function useColumns(props) {
  // value
  const { columns = [], childrenColumnName } = props;
  // hooks ============================================
  const processColumns = React.useCallback((rows) => {
    const _rows = [];
    rows.forEach((row, idx) => {
      const _row = { ...row, key: row.dataIndex || idx };
      _rows.push(_row);
    });
    return _rows;
  }, []);

  const flattenColumns = React.useMemo(
    () => processColumns(getFlattenColumns(columns, childrenColumnName)),
    [columns, childrenColumnName]
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
      return [processColumns(rows)];
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
      rows[current] = processColumns(rows[current]);
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
