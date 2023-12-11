import * as React from 'react';
import { createPortal } from 'react-dom';
import type { AttachNode, AttachNodeReturnValue } from '../type';

export const canUseDocument = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export interface PortalProps {
  /**
   * 指定挂载的 HTML 节点, false 为挂载在 body
   */
  attach?: React.ReactElement | AttachNode | boolean;
  /**
   * 触发元素
   */
  triggerNode?: HTMLElement;
  children: React.ReactNode;
}

export function getAttach(
  attach: PortalProps['attach'],
  triggerNode?: HTMLElement
): AttachNodeReturnValue {
  if (!canUseDocument) return null;

  let el: AttachNodeReturnValue;
  if (typeof attach === 'string') {
    el = document.querySelector(attach);
  }
  if (typeof attach === 'function') {
    el = attach(triggerNode);
  }
  if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
    el = attach;
  }

  // fix el in iframe
  if (el && el.nodeType === 1) return el;

  return document.body;
}

const Portal = React.forwardRef((props: PortalProps, ref) => {
  const { attach, children, triggerNode } = props;
  const classPrefix = 'xzc';

  const container = React.useMemo(() => {
    if (!canUseDocument) return null;
    const el = document.createElement('div');
    el.className = `${classPrefix}-portal-wrapper`;
    return el;
  }, [classPrefix]);

  React.useEffect(() => {
    const parentElement = getAttach(attach, triggerNode);
    parentElement?.appendChild?.(container);

    return () => {
      parentElement?.removeChild?.(container);
    };
  }, [container, attach, triggerNode]);

  React.useImperativeHandle(ref, () => container);

  return canUseDocument ? createPortal(children, container) : null;
});

Portal.displayName = 'Portal';

export default Portal;
