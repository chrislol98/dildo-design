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
    getStore: store.getStore,
    setValue: store.setValue,
    setInitialValues: store.setInitialValues,
    setInitialValue: store.setInitialValue,
  };
}
