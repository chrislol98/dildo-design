class ExecutionContext {
  constructor(lexicalEnvironment, thisBinding) {
    this.variableEnvironment = this.lexicalEnvironment = lexicalEnvironment;
    this.thisBinding = thisBinding;
  }
}
module.exports = ExecutionContext;
