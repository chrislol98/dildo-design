import { default as RawForm } from './form';
import Item from './Item';
type FormType = typeof RawForm & {
  Item: typeof Item;
};

const Form = RawForm as FormType;
// const Form: FormType = RawForm; 报错

Form.Item = Item;

export default Form;
