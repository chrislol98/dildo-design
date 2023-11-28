class EnvironmentRecord {
  constructor(bindings) {
    this.bindings = bindings || {};
  }
  /**
   * 创建变量
   * @param {*} N 名称
   */
  createBinding(N) {
    this.bindings[N] = undefined;
  }
  /**
   * 给N设置值V
   * @param {*} N 名称
   * @param {*} V 值
   */
  setBinding(N, V) {
    this.bindings[N] = V;
  }
  /**
   * 是否绑定一个变量
   * @param {*} N 名称
   */
  hasBinding(N) {
    return N in this.bindings;
  }
  /**
   * 获取N的值
   * @param {*} N   名称
   */
  getBindingValue(N) {
    let value = this.bindings[N];
    if (
      value.type === 'let' ||
      (value.type === 'const' && value.uninitialized)
    ) {
      // api 暂时性死区
      throw new Error(
        `ReferenceError: Cannot access '${N}' before initialization`
      );
    }
    return value;
  }
}
module.exports = EnvironmentRecord;
