import * as React from 'react';
import { useContext } from 'react';
import { FormContext, ItemContext } from './context';
import Control from './control';
function Item(props, ref) {
  return <Control {...props}>{props.children}</Control>;
}

const forwardRefItem = React.forwardRef(Item);

forwardRefItem.displayName = 'Item';

export default forwardRefItem;
