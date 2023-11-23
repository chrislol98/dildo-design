import { toJS } from '@/@formily/reactive';
export const batchSubmit = (target, onSubmit) => {
  onSubmit(toJS(target.values));
};
