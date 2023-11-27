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
  }, [columns, childrenColumnName, rowCount]);

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
