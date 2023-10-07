import { useMount } from 'ahooks';
import { FormContext } from './context';
import useForm from './hooks/useForm';
const Form = (props, ref) => {
  const [formInstance] = useForm(props.form);
  const innerMethods = formInstance.getInnerMethods(true);

  // api useMount hook
  useMount(() => {
    // innerMethods.innerSetInitialValues(props.initialValues);
  });

  innerMethods.innerSetCallbacks({
    onChange: props.onChange,
    onValuesChange: (value, values) => {
      props.onValuesChange?.(value, values);
    },
  });

  const formContextValue = {
    store: formInstance,
  };

  return <FormContext.Provider value={formContextValue}>{props.children}</FormContext.Provider>;
};

export default Form;
