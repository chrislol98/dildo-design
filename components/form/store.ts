import { cloneDeep, set } from '../_util/lodash';
class Store<StoreData> {
  // store
  // 不懂 报错 private store: StoreData = {};
  private store: Partial<StoreData> = {};

  private callbacks: Record<string, any> = {};

 
  public innerSetFieldValue = (field, value) => {
    if (!field) return;
    set(this.store, field, value);
    this.triggerTouchChange({ [field]: value });
    this.triggerValuesChange({ [field]: value });
  };

  public innerSetCallbacks = (values) => {
    this.callbacks = values;
  };

 
  public getFields = () => {
    return cloneDeep(this.store);
  };

  
  private triggerTouchChange(value) {
    if (value && Object.keys(value).length) {
      const { onChange } = this.callbacks;
      onChange && onChange(value, this.getFields());
    }
  }
  private triggerValuesChange(value) {
    if (value && Object.keys(value).length) {
      const { onValuesChange } = this.callbacks;
      onValuesChange && onValuesChange(value, this.getFields());
    }
  }


  public submit = () => {
    const { onSubmit } = this.callbacks;
    onSubmit && onSubmit(this.getFields());
  }
}

export default Store;


