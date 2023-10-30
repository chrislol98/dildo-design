import { cloneDeep, set } from '../_util/lodash';
import promisify from '../_util/promisify'
class Store<StoreData> {
  // store
  // 不懂 报错 private store: StoreData = {};
  private store: Partial<StoreData> = {};

  private callbacks: Record<string, any> = {};

  private registerFields: Record<string, any> = [];

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



  public registerField = (item) => {
    this.registerFields.push(item);
   

    return () => {
      this.registerFields = this.registerFields.filter((x) => x !== item);
      
    };
  };


  private getRegisteredFields = (
    hasField?: boolean,
    options?: { containFormList?: boolean }
  ) => {
    if (hasField) {
      return this.registerFields.filter(
        (control) =>
          control.hasFieldProps() && (options?.containFormList || !control.props?.isFormList)
      );
    }
    return this.registerFields;
  };

  public getRegisteredField = (field) => {
    return this.registerFields.filter((x) => x.props.field === field)[0];
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


  public validate = promisify((fieldsOrCallback, callback) => {
    let controlItems = this.getRegisteredFields(true, {

    });
    const promises = controlItems.map((x) => x.validateField());
    Promise.all(promises).then((result) => {
      let errors = {};
      const values = {};

      result.map((x) => {
        if (x.error) {
          errors = { ...errors, ...x.error };
        }
      });

      if (Object.keys(errors).length) {
        const { onValidateFail } = this.callbacks;
        onValidateFail && onValidateFail(errors);
        callback && callback(errors, cloneDeep(values));
      } else {
        callback && callback(null, cloneDeep(values));
      }
    });

  })

  public submit = () => {
    const { onSubmit } = this.callbacks;
    onSubmit && onSubmit(this.getFields());
  }
}

export default Store;


