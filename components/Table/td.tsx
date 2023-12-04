import { useComponent, getOriginData } from './shared';
import { isObject } from '../shared';
import * as React from 'react';
import get from 'lodash/get';
function isInvalidRenderElement(element) {
  return element && !React.isValidElement(element) && isObject(element);
}

const Td = (props) => {
  const { components, column, record, trIndex } = props;
  const { ComponentBodyCell, ComponentTd } = useComponent(components);
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
    return renderElement || get(record, column.dataIndex);
  }

  if (tdProps.colSpan === 0 || tdProps.rowSpan === 0) {
    return null;
  }
  return (
    <ComponentTd {...tdProps}>
      <ComponentBodyCell>{renderChildren()}</ComponentBodyCell>
    </ComponentTd>
  );
};

export default Td;
