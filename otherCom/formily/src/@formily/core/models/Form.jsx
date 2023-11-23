import { define, observable } from '@/@formily/reactive';
import { FormPath } from '@/@formily/shared';
import { batchSubmit } from '../shared/internals';
import { Field } from './Field';
export class Form {
  values = {};
  fields = {};
  constructor(props) {
    this.initialize(props);
    this.makeObservable();
    this.makeValues();
  }
  initialize(props) {
    this.props = { ...props };
  }
  makeObservable() {
    define(this, {
      values: observable,
      fields: observable.shallow,
    });
  }
  makeValues() {
    this.values = Object.assign({}, this.props.values);
  }
  createField(props) {
    const address = FormPath.parse().concat(props.name);
    new Field(address, props, this);
    return this.fields[address.entire];
  }
  setValuesIn = (pattern, value) => {
    this.values[pattern.entire] = value;
  };
  getValuesIn = (pattern) => {
    return this.values[pattern.entire];
  };
  submit = (onSubmit) => {
    return batchSubmit(this, onSubmit);
  };
}
