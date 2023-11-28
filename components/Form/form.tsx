import * as React from 'react';
import { FormContext } from './context';
import useForm from './useForm';
import { useCreate } from '../shared';
function Form(props, ref) {
  const [formInstance] = useForm(props.form);

  useCreate(() => {
    formInstance.setInitialValues(props.initialValues);
  });

  formInstance.setCallbacks({
    onChange: props.onChange,
    onSubmit: props.onSubmit,
    onSubmitFailed: props.onSubmitFail,
  });

  React.useImperativeHandle(ref, () => {
    return formInstance;
  });

  const FormContextValue = {
    formInstance,
  };
  return (
    <FormContext.Provider value={FormContextValue}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formInstance.submit();
        }}
      >
        {props.children}
      </form>
    </FormContext.Provider>
  );
}

const forwardRefForm = React.forwardRef(Form);

forwardRefForm.displayName = 'Form';

export default forwardRefForm;
