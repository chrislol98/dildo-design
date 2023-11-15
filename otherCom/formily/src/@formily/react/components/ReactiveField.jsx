import { observer } from '@/@formily/reactive-react';
import React from 'react';
const ReactiveInternal = (props) => {
  const field = props.field;
  const renderDecorator = (children) => {
    return React.createElement(field.decoratorType, {}, children);
  };
  const renderComponent = () => {
    const value = field.value;
    const onChange = (...args) => {
      field.onInput(...args);
    };
    return React.createElement(field.componentType, {
      value,
      onChange,
    });
  };
  return renderDecorator(renderComponent());
};
export const ReactiveField = observer(ReactiveInternal);
