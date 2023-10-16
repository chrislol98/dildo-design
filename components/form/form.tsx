import { useMount } from 'ahooks';
import { FormContext } from './context';
import useForm from './hooks/useForm';

const Form = (props, ref) => {
  const [formInstance] = useForm(props.form);
  const innerMethods = formInstance.getInnerMethods(true);


  const {Wrapper = 'form'} = props;
  // api useMount 
  useMount(() => {
    // innerMethods.innerSetInitialValues(props.initialValues);
  });

  innerMethods.innerSetCallbacks({
    onChange: props.onChange,
    onValuesChange: (value, values) => {
      props.onValuesChange?.(value, values);
    },
    onSubmit:(values) => {
      props.onSubmit(values);
    }
  });

  const formContextValue = {
    store: formInstance,
  };

  return <FormContext.Provider value={formContextValue}>

        <Wrapper  
        onSubmit={(e) => {
          // 不懂 为什么要这两个
                  e.preventDefault();
                  e.stopPropagation();
                  formInstance.submit();
                }}>
        {props.children}
        </Wrapper>

  </FormContext.Provider>;
};

export default Form;
