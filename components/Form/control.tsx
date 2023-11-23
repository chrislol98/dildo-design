import get from 'lodash/get';
import * as React from 'react';
import { isSyntheticEvent } from '../shared';
import { ItemContext, FormContext } from './context';
export default class Control extends React.Component<any> {
  // 不懂 static 有什么用？
  static contextType = FormContext;
  context: any;
  removeRegisterField;
  constructor(props, context) {
    super(props);
    const { field } = props;
    const { formInstance } = context;
    if ('initialValue' in props && field) {
      formInstance.setInitialValue(field, props.initialValue);
    }
  }
  componentDidMount() {
    const { formInstance } = this.context;
    this.removeRegisterField = formInstance.registerField(this);
  }
  componentWillUnmount() {
    this.removeRegisterField?.();
  }
  onStoreChange = () => {
    this.forceUpdate();
  };

  handleTrigger = (value) => {
    const { formInstance } = this.context;
    const { field } = this.props;
    if (isSyntheticEvent(value)) {
      value = value.nativeEvent.target.value;
    }
    formInstance.setValue(field, value);
  };

  // todo
  validate = () => {
    const { formInstance } = this.context;
    const value = formInstance

  };


  render() {
    const { field, children } = this.props;
    const { formInstance } = this.context;

    if (field) {
      const childProps = {
        onChange: this.handleTrigger,
        value: get(formInstance.getStore(), field),
      };
      return <div>{React.cloneElement(children, childProps)}</div>;
    } else {
      return children;
    }
  }
}
