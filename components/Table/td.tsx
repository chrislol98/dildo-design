import { useComponent } from './shared';
import * as React from 'react';
import get from 'lodash/get';
const Td = (props) => {
  const { components, column, record } = props;
  const { ComponentBodyCell, ComponentTd } = useComponent(components);
  return (
    <ComponentTd>
      <ComponentBodyCell>{get(record, column.dataIndex)}</ComponentBodyCell>
    </ComponentTd>
  );
};

export default Td;
