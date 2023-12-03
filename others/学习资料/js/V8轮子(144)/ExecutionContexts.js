class ExecutionContexts {
  constructor() {
      this.executionContexts = [];
  }
  push(executionContext) {
      this.executionContexts.push(executionContext);
  }
  get current() {
      return this.executionContexts[this.executionContexts.length - 1];
  }
  pop() {
      this.executionContexts.pop();
  }
}
module.exports = ExecutionContexts;