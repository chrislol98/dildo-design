import * as React from 'react';
import isFunction from 'lodash/isFunction';
import { usePopper } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
import { Placement } from '@popperjs/core';
import { getTransitionParams } from './utils';
import classNames from 'classnames';
import { popupDefaultProps } from './defaultProps';
import { useDefaultProps, useControlled } from '../shared';
import { useTrigger, getRefDom } from './shared';
import Portal from '../Portal';
import { PopupRef, PopupProps, TdPopupProps } from './type';

const Popup = React.forwardRef<PopupRef, PopupProps>((_props, ref) => {
  const props = useDefaultProps<PopupProps>(_props, popupDefaultProps);
  const classPrefix = 'xzc';
  const {
    placement,
    popperOptions,
    content,
    disabled,
    trigger,
    delay,
    attach,
    triggerElement,
    zIndex,
    overlayClassName,
    overlayInnerClassName,
    overlayStyle,
    overlayInnerStyle,
    hideEmptyPopup,
    destroyOnClose,
    children = triggerElement,
  } = props;
  const [visible, onVisibleChange] = useControlled(props, 'visible', props.onVisibleChange);
  const popperRef = React.useRef(null);
  const portalRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const popupRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const [popupElement, setPopupElement] = React.useState(null);
  const popperPlacement = React.useMemo(
    () =>
      placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement,
    [placement]
  );

  React.useImperativeHandle(ref, () => ({
    getPopper: () => popperRef.current,
    getPopupElement: () => popupRef.current,
    getPortalElement: () => portalRef.current,
    getPopupContentElement: () => contentRef.current,
    setVisible: (visible: boolean) => onVisibleChange(visible, { trigger: 'document' }),
  }));

  function renderTriggerNode() {
    const { getTriggerNode, getTriggerDom } = useTrigger({
      triggerRef,
      content,
      disabled,
      trigger,
      visible,
      delay,
      onVisibleChange,
    });
    return isFunction(children)
      ? getTriggerNode((children as unknown as Function)({ visible }))
      : getTriggerNode(children);
  }
  function renderOverlay() {
    // 整理浮层样式
    function getOverlayStyle(overlayStyle: TdPopupProps['overlayStyle']) {
      if (getRefDom(triggerRef) && popupRef.current && typeof overlayStyle === 'function') {
        return { ...overlayStyle(getRefDom(triggerRef), popupRef.current) };
      }
      return { ...overlayStyle };
    }
    const showOverlay = React.useMemo(() => {
      if (hideEmptyPopup && !content) return false;
      return visible || popupElement;
    }, [hideEmptyPopup, content, visible, popupElement]);
    popperRef.current = usePopper(getRefDom(triggerRef), popupElement, {
      placement: popperPlacement,
      ...popperOptions,
    });
    const { styles, attributes } = popperRef.current;
    function handleExited() {
      !destroyOnClose && popupElement && (popupElement.style.display = 'none');
    }
    function handleEnter() {
      !destroyOnClose && popupElement && (popupElement.style.display = 'block');
    }

    return (
      showOverlay && (
        <CSSTransition
          appear
          in={visible}
          nodeRef={portalRef}
          unmountOnExit={destroyOnClose}
          onEnter={handleEnter}
          onExited={handleExited}
        >
          <Portal triggerNode={getRefDom(triggerRef)} attach={attach} ref={portalRef}>
            <CSSTransition appear timeout={0} in={visible} nodeRef={popupRef}>
              <div
                ref={(node) => {
                  if (node) {
                    popupRef.current = node;
                    setPopupElement(node);
                  }
                }}
                style={{ ...styles.popper, zIndex, ...getOverlayStyle(overlayStyle) }}
                className={classNames(`${classPrefix}-popup`, overlayClassName)}
                {...attributes.popper}
              >
                <div
                  ref={contentRef}
                  className={classNames(`${classPrefix}-popup__content`, overlayInnerClassName)}
                  style={getOverlayStyle(overlayInnerStyle)}
                >
                  {content}
                </div>
              </div>
            </CSSTransition>
          </Portal>
        </CSSTransition>
      )
    );
  }

  return (
    <React.Fragment>
      {renderTriggerNode()}
      {renderOverlay()}
    </React.Fragment>
  );
});

Popup.displayName = 'Popup';
export default Popup;
