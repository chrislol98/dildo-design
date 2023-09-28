import { cloneDeep, set } from '../_util/lodash';
class Store {
  // store
  private store = {};

  private callbacks: Record<string, any> = {};

  // setValue
  public innerSetFieldValue = (field, value) => {
    if (!field) return;
    set(this.store, field, value);
    this.triggerTouchChange({ [field]: value } as unknown as Partial<FormData>);
  };

  public innerSetCallbacks = (values) => {
    this.callbacks = values;
  };

  // getValue
  public getFields = (): Partial<FormData> => {
    return cloneDeep(this.store);
  };

  // dispatch
  private triggerTouchChange(value: Partial<FormData>) {
    if (value && Object.keys(value).length) {
      const { onChange } = this.callbacks;
      onChange && onChange(value, this.getFields());
    }
  }
}

export default Store;
