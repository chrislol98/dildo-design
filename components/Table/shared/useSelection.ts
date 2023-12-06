import * as React from 'react';
import {
  isChildrenNotEmpty,
  getOriginData,
  getSelectedKeys,
  getSelectedKeysByData,
  unique,
} from '../shared';
import { isArray } from '../../shared';

export default function useSelection(props, pageData, data, getRowKey) {
  const { rowSelection, childrenColumnName } = props;

  const {
    allSelectedRowKeys, // 所有的可以选择的行（除了disabled的）
    flattenData,
  } = getMetaFromData();

  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [indeterminateKeys, setIndeterminateKeys] = React.useState([]);
  const controlledSelectedRowKeys = rowSelection?.selectedRowKeys;
  const checkConnected =
    typeof rowSelection?.checkStrictly === 'boolean' ? !rowSelection.checkStrictly : false;
  // 不懂 checkConnected(父子关联)/controlledSelectedRowKeys(受控)有关
  const keys = getSelectedKeysByData(
    flattenData,
    unique(controlledSelectedRowKeys || selectedRowKeys),
    getRowKey,
    childrenColumnName,
    checkConnected
  );
  const flattenKeys = new Set(flattenData.map((d) => getRowKey(d)));
  const mergedSelectedRowKeys =
    checkConnected && !controlledSelectedRowKeys ? selectedRowKeys : keys.selectedRowKeys;
  // 不懂 不知道干啥的
  const mergedIndeterminateKeys =
    checkConnected && !controlledSelectedRowKeys ? indeterminateKeys : keys.indeterminateKeys;
  const [selectedRows, setSelectedRows] = React.useState(getRowsFromKeys(mergedSelectedRowKeys));

  function getRowsFromKeys(keys, plus?) {
    // 不懂 selectedRows is placed before flattenData
    // selectedRows is placed before flattenData: https://github.com/arco-design/arco-design/issues/1294
    const all = plus ? selectedRows.concat(flattenData) : flattenData;

    const keyMap = new Map(all.map((v) => [getRowKey(v), v]));
    return keys.map((r) => keyMap.get(r)).filter((a) => a);
  }
  // 列表某项删除了，删除对应的key
  function deleteUnExistKeys(keys) {
    return keys.filter((k) => flattenKeys.has(k));
  }

  function onCheckAll(checked) {
    console.log(checked, 'checked');
    let newSelectedRowKeys = [];
    let newSelectedRows = [];

    if (checked) {
      // 不懂 why use concat ? why use unique ?  unique(mergedSelectedRowKeys.concat(allSelectedRowKeys))
      newSelectedRowKeys = deleteUnExistKeys(unique(allSelectedRowKeys));
    } else {
      const tempSet = new Set(allSelectedRowKeys);
      newSelectedRowKeys = deleteUnExistKeys(
        mergedSelectedRowKeys.filter((key) => !tempSet.has(key))
      );
    }

    newSelectedRows = getRowsFromKeys(newSelectedRowKeys, true);

    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
    setIndeterminateKeys([]);
  }

  function onCheck(checked, record) {
    const { selectedRowKeys, indeterminateKeys: _indeterminateKeys } = getSelectedKeys(
      record,
      checked,
      mergedSelectedRowKeys,
      indeterminateKeys,
      getRowKey,
      childrenColumnName,
      checkConnected
    );
    const newSelectedRowKeys = deleteUnExistKeys(selectedRowKeys);
    const newSelectedRows = getRowsFromKeys(newSelectedRowKeys, true);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
    setIndeterminateKeys(_indeterminateKeys);
    // const originSelectedRows = getOriginData(newSelectedRows);
    // onSelect && onSelect(checked, getOriginData(record), originSelectedRows);
    // onChange && onChange(newSelectedRowKeys, originSelectedRows);
  }

  function getMetaFromData() {
    const allSelectedRowKeys = [];
    const flattenData = [];

    const travel = (children) => {
      if (isArray(children) && children.length) {
        children.forEach((record) => {
          const rowKey = getRowKey(record);
          const checkboxProps =
            rowSelection && typeof rowSelection.checkboxProps === 'function'
              ? rowSelection.checkboxProps(getOriginData(record))
              : {};
          if (!checkboxProps.disabled) {
            allSelectedRowKeys.push(rowKey);
          }
          if (isChildrenNotEmpty(record, props.childrenColumnName)) {
            travel(record[props.childrenColumnName]);
          }
        });
      }
    };

    const travelOrigin = (children, parent) => {
      if (isArray(children) && children.length) {
        children.forEach((record) => {
          if (parent && checkConnected) {
            record.__INTERNAL_PARENT = parent;
          }
          flattenData.push(record);
          if (isChildrenNotEmpty(record, props.childrenColumnName)) {
            const _parent = { ...record };
            travelOrigin(record[props.childrenColumnName], _parent);
          }
        });
      }
    };
    travel(pageData);
    travelOrigin(data, undefined);

    return {
      allSelectedRowKeys,
      flattenData,
    };
  }

  return {
    selectedRowKeys: mergedSelectedRowKeys,
    indeterminateKeys: mergedIndeterminateKeys,
    onCheckAll,
    onCheck,
    setSelectedRowKeys,
    allSelectedRowKeys,
    flattenData,
  };
}
