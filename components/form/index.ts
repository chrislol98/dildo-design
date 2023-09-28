import { default as RawForm } from './form';
import FormItem from './form-item';

type RawFormType = typeof RawForm;

type FormType = RawFormType & {
  Item?: typeof FormItem;
};
const Form: FormType = RawForm;

Form.Item = FormItem;

export default Form;
