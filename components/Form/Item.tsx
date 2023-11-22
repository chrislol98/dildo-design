import * as React from 'react';
import { useContext } from 'react';
import { FormContext, ItemContext } from './context';
import Control from './control';
function Item(props, ref) {
  const formContext = useContext(FormContext);

  return (
    <ItemContext.Provider value={{ ...formContext }}>
      <Control {...props}>{props.children}</Control>
    </ItemContext.Provider>
  );
}

const forwardRefItem = React.forwardRef(Item);

forwardRefItem.displayName = 'Item';

export default forwardRefItem;
