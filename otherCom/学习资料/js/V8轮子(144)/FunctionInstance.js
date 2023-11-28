class FunctionInstance {

  // api scope 父词法环境
  constructor(name, code, scope) {
      this.name = name;
      this.code = code;
      this.scope = scope;
  }
}
module.exports = FunctionInstance;