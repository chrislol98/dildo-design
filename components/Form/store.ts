import set from 'lodash/set';
export default class Store {
  private store = {};
  private registerFields = [];
  private callbacks: any = {};

  public submit = () => {};

  public registerField = (item) => {
    this.registerFields.push(item);
  };
  public getStore = () => {
    return this.store;
  };
  
  public setValue = (field, value) => {
    set(this.store, field, value);
    this.triggerChange({ field: value });
    this.notify();
  };
  public triggerChange = (value) => {
    const { onChange } = this.callbacks;
    // todo deepClone
    onChange?.(value, this.getStore());
  };
  public setCallbacks = (values) => {
    this.callbacks = values;
  };
  public setInitialValues = (initialValues) => {
    this.store = initialValues;
  };
  public setInitialValue = (field,initialValue) => {
    this.store[field] = initialValue
  }

  notify = () => {
    this.registerFields.forEach((item) => {
      item.onStoreChange();
    });
  };
}
