import { useComponent } from './shared';
import * as React from 'react';
import Td from './td';
const Th = (props, ref) => {
  // value
  const {
    components,
    column: { colSpan, title },
  } = props;
  // hooks
  const { ComponentTh, ComponentHeaderCell } = useComponent(components);
  // setup
  // render
  const renderChildren = () => {
    title;
  };
  const renderTh = () => {
    if (colSpan) {
      return (
        <ComponentTh>
          <ComponentHeaderCell>{renderChildren()}</ComponentHeaderCell>
        </ComponentTh>
      );
    } else {
      return null;
    }
  };
  return renderTh();
};

export default Th;
