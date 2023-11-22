import get from 'lodash/get'
import set from 'lodash/set'
export default class Store {
  private store =  {};
  // private initialValues ={};
  public submit = () => {};
  public getFields = () => {};
  public registerField = () => {};
  public getStore = () => {
    return this.store
  }

  public setValue = (field, value) => {
    set(this.store, field, value)
  }
}
