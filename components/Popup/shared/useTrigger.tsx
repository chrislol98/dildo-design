import * as React from 'react';
import { TNode } from '../type';
import { isFragment } from 'react-is';
import { supportRef, composeRefs } from '.';
export default function useTrigger({
  content,
  disabled,
  trigger,
  visible,
  onVisibleChange,
  triggerRef,
  delay,
}) {
  const visibleTimer = React.useRef(null);
  const triggerDataKey = React.useRef(`t-popup--${Math.random().toFixed(10)}`);
  // 解析 delay 数据类型
  const [appearDelay = 0, exitDelay = 0] = React.useMemo(() => {
    if (Array.isArray(delay)) return delay;
    return [delay, delay];
  }, [delay]);

  function callFuncWithDelay({ delay, callback }: { delay?: number; callback: Function }) {
    if (delay) {
      clearTimeout(visibleTimer.current);
      visibleTimer.current = setTimeout(callback, delay);
    } else {
      callback();
    }
  }
  const shouldToggle = !disabled && content === 0 ? true : content;

  function getTriggerProps(triggerNode: React.ReactElement) {
    if (!shouldToggle) return {};
    const triggerProps: Record<PropertyKey, any> = {
      onClick: (e: MouseEvent) => {
        if (trigger === 'click') {
          callFuncWithDelay({
            delay: visible ? appearDelay : exitDelay,
            callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-click' }),
          });
        }
        triggerNode.props.onClick?.(e);
      },
      onMouseEnter: (e: MouseEvent) => {
        if (trigger === 'hover') {
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
          });
        }
        triggerNode.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e: MouseEvent) => {
        if (trigger === 'hover') {
          callFuncWithDelay({
            delay: exitDelay,
            callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-hover' }),
          });
        }
        triggerNode.props.onMouseLeave?.(e);
      },
    };

    if (supportRef(triggerNode)) {
      triggerProps.ref = composeRefs(triggerRef, (triggerNode as any).ref);
    } else {
      // 标记 trigger 元素
      triggerProps['data-popup'] = triggerDataKey.current;
    }

    return triggerProps;
  }

  const getTriggerNode = React.useCallback(
    (children: TNode) => {
      const triggerNode =
        React.isValidElement(children) && !isFragment(children) ? (
          children
        ) : (
          <span className="t-trigger">{children}</span>
        );
      return React.cloneElement(triggerNode, getTriggerProps(triggerNode));
    },
    [getTriggerProps]
  );
  // ref 透传失败时使用 dom 查找
  const getTriggerDom = React.useCallback(() => {
    if (typeof document === 'undefined') return {};
    return document.querySelector(`[data-popup="${triggerDataKey.current}"]`);
  }, []);

  return {
    getTriggerNode,
    getTriggerDom,
  };
}
