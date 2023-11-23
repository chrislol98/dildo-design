import set from 'lodash/set';
import { promisify } from '../shared';
import get from 'lodash/get';
export default class Store {
  private store = {};
  private initialValues = {};
  private registerFields = [];
  private callbacks: any = {};

  // 不懂 (...rest: any) => {}  为什么加了这个this.validate就不会报错
  public validate: (...rest: any) => {} = promisify((cb) => {
    const registeredFields = this.getRegisteredFields();
    const promises = registeredFields.map((x) => x.validate());
    Promise.all(promises).then((result) => {
      let errors = {};
      let values = {};
      result.map((cur) => {
        if (cur.error) {
          errors = { ...errors, ...cur.error };
        }
        if (cur.value) {
          set(values, cur.field, cur.value);
        }
      });

      if (Object.keys(errors).length) {
        cb?.(errors, values);
      } else {
        cb?.(null, values);
      }
    });
  });

  public submit = () => {
    this.validate((errors, values) => {
      const { onSubmit, onSubmitFailed } = this.callbacks;
      let result;
      if (errors) {
        result = onSubmitFailed(errors);
      } else {
        result = onSubmit(values);
      }
    });
  };

  public registerField = (item) => {
    this.registerFields.push(item);
    return () => {
      this.registerFields = this.registerFields.filter((x) => x !== item);
    };
  };
  public getRegisteredFields = () => {
    return this.registerFields;
  };

  public getStore = () => {
    return this.store;
  };

  public triggerChange = (value) => {
    const { onChange } = this.callbacks;
    // todo deepClone
    onChange?.(value, this.getStore());
  };

  public setCallbacks = (values) => {
    this.callbacks = values;
  };

  public setValue = (field, value) => {
    set(this.store, field, value);
    this.triggerChange({ field: value });
    this.notify();
  };

  public getValue = (field) => {
    return get(this.store, field);
  };

  public setInitialValues = (initialValues) => {
    this.initialValues = initialValues;
  };

  public setInitialValue = (field, initialValue) => {
    this.initialValues[field] = initialValue;
  };

  notify = () => {
    this.registerFields.forEach((item) => {
      item.onStoreChange();
    });
  };

  public resetFields = (field?: string | any[]) => {
    if (typeof field === 'string') field = [field];
    if (Array.isArray(field)) {
      const changeValue = {};
    } else {
    }
  };
}
