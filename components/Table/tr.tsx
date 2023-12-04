import { useComponent } from './shared';
import * as React from 'react';
import Td from './td';
const Tr = (props, ref) => {
  const { columns, record, components, rowKey, index } = props;
  const { ComponentBodyRow, ComponentTd, getBodyComponentOperations } = useComponent(components);
  return (
    <ComponentBodyRow ref={ref}>
      {columns.map((col, idx) => {
        return <Td key={idx} column={col} index={idx} record={record} trIndex={index}></Td>;
      })}
    </ComponentBodyRow>
  );
};

const forwardRefTr = React.forwardRef(Tr);

export default forwardRefTr;
