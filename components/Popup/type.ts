import {
  MouseEvent,
  FocusEvent,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  CSSProperties,
  FormEvent,
  DragEvent,
  SyntheticEvent,
} from 'react';
import type { AttachNode, ClassName, Styles } from '../type';

export type TNode<T = undefined> = T extends undefined
  ? ReactNode
  : ReactNode | ((props: T) => ReactNode);

export interface TdPopupProps {
  onVisibleChange?: (visible: boolean, context: PopupVisibleChangeContext) => void;
  placement?: PopupPlacement;
  popperOptions?: object;
  content?: TNode;
  delay?: number | Array<number>;
  disabled?: boolean;
  trigger?: 'hover' | 'click' | 'focus' | 'mousedown' | 'context-menu';
  children?: TNode;
  triggerElement?: TNode;
  visible?: boolean;
  overlayClassName?: ClassName;
  overlayStyle?: Styles | ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles);
  overlayInnerStyle?: Styles | ((triggerElement: HTMLElement, popupElement: HTMLElement) => Styles);
  zIndex?: number;
  attach?: AttachNode;
  overlayInnerClassName?: ClassName;
  hideEmptyPopup?: boolean;
  destroyOnClose?: boolean;
}

export interface PopupVisibleChangeContext {
  e?: PopupTriggerEvent;
  trigger?: PopupTriggerSource;
}

export type PopupTriggerEvent = MouseEvent | FocusEvent | KeyboardEvent;

export type PopupTriggerSource =
  | 'document'
  | 'trigger-element-click'
  | 'trigger-element-hover'
  | 'trigger-element-blur'
  | 'trigger-element-focus'
  | 'trigger-element-mousedown'
  | 'context-menu'
  | 'keydown-esc';

export type PopupPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom';

export interface PopupProps extends TdPopupProps {}

export interface PopupRef {}
