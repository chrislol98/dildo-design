import set from 'lodash/set';
export default class Store {
  private store = {};
  private registerFields = [];
  public submit = () => {};

  public registerField = (item) => {
    this.registerFields.push(item);
  };
  public getStore = () => {
    return this.store;
  };

  public setValue = (field, value) => {
    set(this.store, field, value);
    this.notify();
  };

  public setInitialValues = (initialValues) => {
    this.store = initialValues;
  };

  notify = () => {
    this.registerFields.forEach((item) => {
      item.onStoreChange();
    });
  };
}
