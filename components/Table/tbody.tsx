import { useComponent, getOriginData } from './shared';
import * as React from 'react';
import Tr from './tr';
const TBody = (props) => {
  // value
  const {
    columns = [],
    data = [],
    components,
    getRowKey,
    expandProps = {},
    expandedRowRender,
    expandedRowKeys = [],
  } = props;
  const enhancedExpandedRowRender = (r, i) => expandedRowRender(getOriginData(r), i);
  const isRowExpandable = function (record, index) {
    if ('rowExpandable' in expandProps && typeof expandProps.rowExpandable === 'function') {
      return expandProps.rowExpandable(record);
    }
    return enhancedExpandedRowRender && enhancedExpandedRowRender(record, index) !== null;
  };
  const trProps = {
    ...props,
    isRowExpandable,
  };
  const { ComponentTbody } = useComponent(components);

  // render
  const renderChildren = () => {
    if (data.length) {
      return data.map((record, index) => {
        const rowKey = getRowKey(record);
        return (
          <React.Fragment key={rowKey}>
            <Tr {...trProps} key={rowKey} index={index} rowKey={rowKey} record={record}></Tr>
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

  const renderExpand = (record, index) => {
    const rowKey = getRowKey(record);
    const shouldRenderExpand = isRowExpandable(record, index) && expandedRowKeys.includes(rowKey);
    return shouldRenderExpand ? (
      <tr>
        <td colSpan={columns.length}>{enhancedExpandedRowRender?.(record, index)}</td>
      </tr>
    ) : (
      false
    );
  };
  return <ComponentTbody>{renderChildren()}</ComponentTbody>;
};

export default TBody;
