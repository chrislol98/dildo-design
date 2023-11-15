import { useForm } from '../hooks';
import { FieldContext } from '../shared';
import { ReactiveField } from './ReactiveField';
export const Field = (props) => {
  const form = useForm();
  const field = form.createField(props);
  return (
    <FieldContext.Provider value={field}>
      <ReactiveField field={field}>{props.children}</ReactiveField>
    </FieldContext.Provider>
  );
};
