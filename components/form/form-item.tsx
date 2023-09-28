import React, { useContext } from 'react';
import { FormContext, FormItemContext } from './context';
import Control from './control';

const Item = (props) => {
  const formContext = useContext(FormContext);
  // 不懂 感觉这么用是不对的，要怎么改
  const formItemContext = {
    ...formContext,
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

  return (
    <FormContext.Provider value={formContext}>
      <FormItemContext.Provider value={formItemContext}>
        {/* // 不懂 为什么不能 cloneElementWithDisabled */}
        {cloneElementWithDisabled()}
      </FormItemContext.Provider>
    </FormContext.Provider>
  );
};

export default Item;