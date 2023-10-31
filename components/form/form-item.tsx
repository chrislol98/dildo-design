import React, {
  cloneElement,
  ReactElement,
  forwardRef,
  useContext,
  PropsWithChildren,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useRef,
} from 'react';
import { FormContext, FormItemContext } from './context';
import Control from './control';

const Item = (props) => {
  const formContext = useContext(FormContext);

  const [errors, setErrors] = useState<{
    [key: string]: any;
  }>(null);
  const [warnings, setWarnings] = useState<{
    [key: string]: ReactNode[];
  }>(null);


  const updateFormItem = (
    field: string,
    params: {
      errors
      warnings
    }
  ) => {

    const { errors, warnings } = params || {};

    setErrors((innerErrors) => {
      const newErrors = { ...(innerErrors || {}) };
      if (errors) {
        newErrors[field] = errors;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });

    setWarnings((current) => {
      const newVal = { ...(current || {}) };
      if (warnings && warnings.length) {
        newVal[field] = warnings;
      } else {
        delete newVal[field];
      }
      return newVal;
    });
  };

  const cloneElementWithDisabled = () => {
    const { field, children } = props;
    if (React.Children.count(children) === 1) {
      const key = field;
      return (
        <Control {...props} key={key}>
          {children}
        </Control>
      );
    }
    return children;
  };


  // 不懂 感觉这么用是不对的，要怎么改
  const formItemContext = {
    ...formContext,
    updateFormItem
  };

  return (
    <FormContext.Provider value={formContext}>
      <FormItemContext.Provider value={formItemContext}>
        {/* // 不懂 为什么不能 cloneElementWithDisabled */}
        {cloneElementWithDisabled()}
        {JSON.stringify(errors)}
        {JSON.stringify(warnings)}
      </FormItemContext.Provider>
    </FormContext.Provider>
  );
};

export default Item;