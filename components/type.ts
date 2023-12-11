import { CSSProperties } from 'react';
export type AttachNode = CSSSelector | ((triggerNode?: HTMLElement) => AttachNodeReturnValue);
export type AttachNodeReturnValue = HTMLElement | Element | Document;
export type CSSSelector = string;
export type ClassName = { [className: string]: any } | ClassName[] | string;
export type Styles = CSSProperties;
