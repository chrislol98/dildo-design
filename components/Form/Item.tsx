import * as React from 'react';
function Item(props, ref) {
  return <div>{props.children}</div>;
}

const forwardRefItem = React.forwardRef(Item);

forwardRefItem.displayName = 'Item';

export default forwardRefItem;
