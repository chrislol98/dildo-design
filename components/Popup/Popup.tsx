import * as React from 'react';
import { popupDefaultProps } from './defaultProps';
import { useDefaultProps, useControlled } from '../shared';
import { useTrigger, getRefDom } from './shared';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import { PopupRef, PopupProps } from './type';

const Popup = React.forwardRef<PopupRef, PopupProps>((_props, ref) => {
  const props = useDefaultProps<PopupProps>(_props, popupDefaultProps);
  const {placement,popperOptions, content, disabled,trigger,delay} = props;
  const [visible, onVisibleChange] = useControlled(props, 'visible', props.onVisibleChange);
  const triggerRef = React.useRef(null);
  const popperRef = React.useRef(null);
  const [popupElement, setPopupElement] = React.useState(null);
  const popperPlacement = React.useMemo(
    () => placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement,
    [placement],
  );

  const { getTriggerNode, getPopupProps, getTriggerDom } = useTrigger({
    triggerRef,
    content,
    disabled,
    trigger,
    visible,
    delay,
    onVisibleChange,
  });
  // const triggerNode = isFunction(children)
  //   ? getTriggerNode(children({ visible }))
  //   : getTriggerNode(children);
  popperRef.current = usePopper(getRefDom(triggerRef), popupElement, {
    placement: popperPlacement,
    ...popperOptions,
  });

  return (
    <React.Fragment>
      {/*{triggerNode}*/}
      {/*{overlay}*/}
    </React.Fragment>
  );
});

Popup.displayName = 'Popup';
export default Popup;
