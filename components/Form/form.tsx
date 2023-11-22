import * as React from 'react';
import { FormContext } from './context';
import useForm from './useForm';
function Form(props, ref) {
  const [formInstance] = useForm(props.form);
  const isMount = React.useRef<any>();
  // todo
  if (!isMount.current) {
    formInstance.setInitialValues(props.initialValues);
  }
  React.useEffect(() => {
    isMount.current = true;
  }, []);

  formInstance.setCallbacks({
    onChange: props.onChange
  })

  React.useImperativeHandle(ref, () => {
    return formInstance;
  });

  
  const FormContextValue = {
    formInstance,
  };
  return (
    <FormContext.Provider value={FormContextValue}>
      <form>{props.children}</form>
    </FormContext.Provider>
  );
}

const forwardRefForm = React.forwardRef(Form);

forwardRefForm.displayName = 'Form';

export default forwardRefForm;
