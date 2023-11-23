import set from 'lodash/set';
import { promisify } from '../shared';
import cloneDeep from 'lodash/cloneDeep';
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
  public setValues = (values) => {
    this.store = values;
  };
  public getValue = (field) => {
    return get(this.store, field);
  };

  public setInitialValues = (initialValues) => {
    this.initialValues = initialValues;

    Object.keys(initialValues).forEach((field) => {
      set(this.store, field, initialValues[field]);
    });
  };

  public setInitialValue = (field, initialValue) => {
    this.initialValues[field] = initialValue;
    set(this.store, field, initialValue);
  };

  notify = () => {
    this.registerFields.forEach((item) => {
      item.onStoreChange();
    });
  };


  // todo
  public resetFields = (fields?: string | any[]) => {
    if (typeof fields === 'string') fields = [fields];
    if (Array.isArray(fields)) {
      const changeValue = {};
      fields.forEach((field) => {
        // set的作用
        // field = 'a.b'
        // 正常    {'a.b': 1} 
        // set    {a: {b: 1}}
        set(this.store, field, this.initialValues[field]);
        changeValue[field] = this.initialValues[field];
      });
    } else {
      this.setValues(cloneDeep(this.initialValues));
    }
  };
}
