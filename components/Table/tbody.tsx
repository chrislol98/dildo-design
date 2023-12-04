import { useComponent } from './shared';
import * as React from 'react';
import Tr from './tr';
const TBody = (props) => {
  // value
  const { columns = [], data = [], components, rowKey } = props;
  const { ComponentTbody } = useComponent(components);

  // handleEffect
  const getRowKey = React.useMemo(() => {
    if (typeof rowKey === 'function') {
      return (record) => rowKey(record);
    } else {
      return (record) => record[rowKey];
    }
  }, [rowKey]);

  // render

  const renderChildren = () => {
    if (data.length) {
      return data.map((record, index) => {
        const rowKey = getRowKey(record);
        return <Tr {...props} key={rowKey} rowKey={rowKey} record={record} index={index}></Tr>;
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
