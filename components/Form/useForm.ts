import * as React from 'react';
import Store from './store';
export default function useForm(form?) {
  const formRef = React.useRef(form);
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      formRef.current = getFormInstance();
    }
  }
  return [formRef.current];
}

function getFormInstance() {
  const store = new Store();
  return {
    setCallbacks: store.setCallbacks,
    registerField: store.registerField,
    setValue: store.setValue,
    getValue: store.getValue,
    getStore: store.getStore,
    setInitialValues: store.setInitialValues,
    setInitialValue: store.setInitialValue,
    submit: store.submit,
    resetFields: store.resetFields,
    clearFields: store.clearFields
  };
}
