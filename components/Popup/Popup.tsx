import * as React from 'react';
import { popupDefaultProps } from './defaultProps';
import { useDefaultProps } from '../shared';
export interface PopupProps extends Record<PropertyKey, any> {}
export interface PopupRef {}
const Popup = React.forwardRef<PopupRef, PopupProps>((props, ref) => {
  props = useDefaultProps<PopupProps>(props, popupDefaultProps);
  return <div> </div>;
});

Popup.displayName = 'Popup';
export default Popup;
