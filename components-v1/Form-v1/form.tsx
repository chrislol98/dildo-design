import { useMount } from 'ahooks';
import { FormContext } from './context';
import useForm from './hooks/useForm';
import useMergeProps from '../../components/_util/hooks';

const defaultProps = {
  Wrapper: 'form',
}

const Form = (baseProps, ref) => {
  const props = useMergeProps(baseProps, defaultProps, {})
  const [formInstance] = useForm(props.form);
  const innerMethods = formInstance.getInnerMethods(true);

  const { Wrapper } = props;
  // api useMount 
  useMount(() => {
    // innerMethods.innerSetInitialValues(props.initialValues);
  });

  innerMethods.innerSetCallbacks({
    onChange: props.onChange,
    onValuesChange: (value, values) => {
      props.onValuesChange?.(value, values);
    },
    onSubmit: (values) => {
      props.onSubmit(values);
    },
    onSubmitFailed: props.onSubmitFailed,
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
