import { connect, mapProps } from '@/@formily/react';
export const BaseItem = ({ children, label }) => {
  return (
    <div>
      <span>{label}</span>
      {children}
    </div>
  );
};

export const FormItem = connect(
  BaseItem,
  mapProps((props, field) => {
    return { label: field.props.title };
  })
);

export default FormItem;
