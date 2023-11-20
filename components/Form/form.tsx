import * as React from 'react';
import { FormContext as RawFormContext } from './context';
function Form(props) {
  const FormContext = React.useContext(RawFormContext);
  return (
    <FormContext.Provider>
      <form>{props.children}</form>
    </FormContext.Provider>
  );
}

const forwardRefForm = React.forwardRef(Form);

forwardRefForm.displayName = 'Form';

export default forwardRefForm;
