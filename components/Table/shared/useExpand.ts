import * as React from 'react';
import { getOriginData, isChildrenNotEmpty } from '.';
export default function useExpand(props, data, getRowKey) {
  const {
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    childrenColumnName = 'children',
    expandProps,
  } = props;
  const getDefaultExpandedRowKeys = () => {
    let rows = [];
    if (props.expendedRowKeys) {
      rows = props.expandedRowKeys;
    } else if (defaultExpandedRowKeys) {
      rows = defaultExpandedRowKeys;
    } else if (defaultExpandAllRows) {
      rows = data
        .map((item, i) => {
          const originItem = getOriginData(item);
          if (
            expandProps &&
            'rowExpandable' in expandProps &&
            typeof expandProps.rowExpandable === 'function'
          ) {
            return expandProps.rowExpandable(originItem) && getRowKey(item);
          }
          if (typeof expandedRowRender === 'function') {
            return expandedRowRender(originItem, i) && getRowKey(item);
          }
          // todo 未实现
          return isChildrenNotEmpty(item, childrenColumnName) && getRowKey(item);
        })
        .filter((x) => x);
    }
    return rows;
  };
  const [expandedRowKeys, setExpandedRowKeys] = React.useState(getDefaultExpandedRowKeys());
  const mergedExpandedRowKeys = props.expandedRowKeys || expandedRowKeys;
  const onClickExpandBtn = React.useCallback(
    (key) => {
      const isExpanded = mergedExpandedRowKeys.indexOf(key) === -1;
      const newExpandedRowKeys = isExpanded
        ? mergedExpandedRowKeys.concat(key)
        : mergedExpandedRowKeys.filter((_k) => key !== _k);

      const sortedExpandedRowKeys = data
        .filter((record) => newExpandedRowKeys.indexOf(getRowKey(record)) !== -1)
        .map((record) => getRowKey(record));
      setExpandedRowKeys(sortedExpandedRowKeys);
    },
    // 不懂 setExpandedRowKeys 是不是新函数，要不要加
    [mergedExpandedRowKeys, data, setExpandedRowKeys, getRowKey]
  );
  return [mergedExpandedRowKeys, onClickExpandBtn];
}
