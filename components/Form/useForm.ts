import * as React from 'react';
import Store from './store';
export default function useForm(form) {
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

export function getFormInstance() {
  const store = new Store();
  return {
    submit: store.submit,
    getFields: store.getFields,
    registerField: store.registerField,
  };
}
