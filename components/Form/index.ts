import RawForm from './form';
import Item from './item';
import useForm from './useForm';
type FormType = typeof RawForm & {
  Item: typeof Item;
  useForm: typeof useForm;
};

const Form = RawForm as FormType;
// const Form: FormType = RawForm; 报错

Form.Item = Item;
Form.useForm = useForm;
export default Form;
