import React, { Component } from 'react';
import { isSyntheticEvent } from '../_util/is';
import { FormItemContext } from './context';

export default class Control extends Component<any> {
  static defaultProps = {
    trigger: 'onChange',
    triggerPropName: 'value',
  };

  static contextType = FormItemContext;
  context: React.ContextType<typeof FormItemContext>;

  child: any;

  private removeRegisterField: () => void;

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    const { store } = this.context;
    if (store) {
      const innerMethods = store.getInnerMethods(true);
      this.removeRegisterField = innerMethods.registerField(this);
    }
  }

  componentWillUnmount() {
    this.removeRegisterField && this.removeRegisterField();
    this.removeRegisterField = null;

  }
  validateField = (

  ): Promise<{
    error,
    value;
    field
  }> => {

    const { field, rules, validateTrigger } = this.props;
    const value = this.getFieldValue();

   
    return Promise.resolve({ error: null, value, field });
  };
  handleTrigger = (_value, ...args) => {
    const { field } = this.props;
    if (isSyntheticEvent(_value)) {
      _value = _value.nativeEvent.target.value;
    }
    this.innerSetFieldValue(field, _value);
  };

  innerSetFieldValue = (field, value) => {
    if (!field) return;
    const { store } = this.context;
    const methods = store.getInnerMethods(true);
    methods.innerSetFieldValue(field, value);
  };

  renderControl(children, field) {
    const { trigger } = this.props;
    const child = React.Children.only(children);
    const childProps = {
      [trigger]: this.handleTrigger,
      id: field,
    };
    return React.cloneElement(child, childProps);
  }

  render() {
    const { children, field } = this.props;
    let child = this.renderControl(children, field);
    return child;
  }
}
  