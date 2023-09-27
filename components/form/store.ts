import { cloneDeep } from '../_util/lodash';

class Store {
  // store
  private callbacks: any = {};
  private store = {};

  // setValue
  public innerSetFieldValue = (field, value) => {
    if (!field) return;
    this.triggerTouchChange({ [field]: value } as unknown as Partial<FormData>);
  };

  // getValue
  public getFields = (): Partial<FormData> => {
    return cloneDeep(this.store);
  };

  // dispatch
  private triggerTouchChange(value) {
    if (value && Object.keys(value).length) {
      const { onChange } = this.callbacks;
      onChange?.(value, this.getFields());
    }
  }
}

export default Store;
