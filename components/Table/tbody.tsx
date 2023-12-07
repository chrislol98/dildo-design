import { useComponent, getOriginData, isChildrenNotEmpty, getRowKey } from './shared';

import { isArray } from '../shared';
import * as React from 'react';
import Tr from './tr';
const TBody = (props) => {
  // value
  const {
    columns = [],
    data = [],
    components,
    rowKey,
    expandProps = {},
    expandedRowRender,
    childrenColumnName,
    expandedRowKeys = [],
  } = props;
  const er = expandedRowRender ? (r, i) => expandedRowRender?.(getOriginData(r), i) : null;

  const shouldRowExpand = function (record, index) {
    if ('rowExpandable' in expandProps && typeof expandProps.rowExpandable === 'function') {
      return expandProps.rowExpandable(record);
    }
    return er && er(record, index) !== null;
  };
  const trProps = {
    ...props,
    shouldRowExpand,
  };
  const { ComponentTbody } = useComponent(components);

  // render
  const renderTreeTrs = (record, index) => {
    const trList = [];
    trList.push(
      <Tr key={getRowKey(record, rowKey)} {...trProps} record={record} index={index} level={0}></Tr>
    );

    const travel = (children, rowKeyValue, level = 0) => {
      if (isArray(children) && children.length) {
        children.forEach((child, i) => {
          if (expandedRowKeys.indexOf(rowKeyValue) !== -1) {
            trList.push(
              <Tr
                {...trProps}
                key={getRowKey(child, rowKey)}
                record={child}
                index={i}
                level={level + 1}
              ></Tr>
            );
          }
          if (isChildrenNotEmpty(child, childrenColumnName)) {
            travel(child[childrenColumnName], getRowKey(child, rowKey), level + 1);
          }
        });
      }
    };
    // priority er > data.children
    if (!er) {
      travel(record[childrenColumnName], getRowKey(record, rowKey));
    }

    return trList;
  };
  const renderExpand = (record, index) => {
    const _rowKey = getRowKey(record, rowKey);
    const shouldRenderExpand = shouldRowExpand(record, index) && expandedRowKeys.includes(_rowKey);
    return shouldRenderExpand ? (
      <tr>
        <td colSpan={columns.length}>{er?.(record, index)}</td>
      </tr>
    ) : (
      false
    );
  };

  const renderChildren = () => {
    if (data.length) {
      return data.map((record, index) => {
        const _rowKey = getRowKey(record, rowKey);
        return (
          <React.Fragment key={_rowKey}>
            {renderTreeTrs(record, index)}
            {renderExpand(record, index)}
          </React.Fragment>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={columns.length}>
            <p>no data</p>
          </td>
        </tr>
      );
    }
  };
  return <ComponentTbody>{renderChildren()}</ComponentTbody>;
};

export default TBody;
