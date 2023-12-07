import { useComponent, getOriginData, getRowKey } from './shared';
import { isObject } from '../shared';
import * as React from 'react';
import get from 'lodash/get';
function isInvalidRenderElement(element) {
  return element && !React.isValidElement(element) && isObject(element);
}

const Td = (props) => {
  const {
    components,
    column,
    record,
    trIndex,
    rowKey: _rowKey,
    level,
    haveTreeData,
    recordHaveChildren,
    renderExpandIcon,
    indentSize,
  } = props;
  const rowKey = getRowKey(record, _rowKey);
  const { ComponentBodyCell, ComponentTd } = useComponent(components);
  const hasInlineExpandIcon = haveTreeData && column.$$isFirstColumn;
  const needRenderExpandIcon = hasInlineExpandIcon && recordHaveChildren;
  let paddingLeft = hasInlineExpandIcon && level > 0 ? indentSize * level : 0;

  let tdProps: {
    rowSpan?: number;
    colSpan?: number;
  } = {};

  let renderElement = React.useMemo(
    () => column?.render?.(get(record, column.dataIndex), getOriginData(record), trIndex),
    [record, column, trIndex]
  );
  if (isInvalidRenderElement(renderElement)) {
    tdProps = renderElement.props;
    renderElement = renderElement.children;
  }

  function renderChildren() {
    if (tdProps.colSpan === 0 || tdProps.rowSpan === 0) {
      return null;
    }
    return (
      <ComponentTd {...tdProps}>
        {paddingLeft ? <span className="indent" style={{ paddingLeft }} /> : null}
        {needRenderExpandIcon ? renderExpandIcon(record, rowKey) : null}

        <ComponentBodyCell>{renderElement || get(record, column.dataIndex)}</ComponentBodyCell>
      </ComponentTd>
    );
  }

  return renderChildren();
};

export default Td;
