const ObjectEnvironmentRecords = require("./ObjectEnvironmentRecords");
const LexicalEnvironment = require("./LexicalEnvironment");
const ExecutionContext = require("./ExecutionContext");
const ExecutionContexts = require("./ExecutionContexts");
const FunctionInstance = require("./FunctionInstance");

// api 这个就是函数栈 创建执行上下文栈
const ECStack = new ExecutionContexts();

// 1. 全局执行上下文推入
// 全局环境记录项，
// 负责登记全局变量，放的就是我们window或者说全局变量
const globalEnvironmentRecord = new ObjectEnvironmentRecords(global);

// 全局词法环境
// 用来登记变量和查找变量
const globalLexicalEnvironment = new LexicalEnvironment(globalEnvironmentRecord, null);
//全局执行上下文，他的this为global
let globalExecutionContext = new ExecutionContext(globalLexicalEnvironment, global);

//把全局执行上下文放入执行上下文栈
ECStack.push(globalExecutionContext);

// 2. 变量提升
//创建a变量并初始化为undefined
ECStack.current.lexicalEnvironment.createBinding("a");
ECStack.current.lexicalEnvironment.setBinding("a", undefined);
// 创建fn变量并赋值为函数
// api 静态作用域 现在这个ECStack.current.lexicalEnvironment就是父词法环境，也就是静态作用域链
let oneFn = new FunctionInstance(
  "one",
  "var b = 2;\nconsole.log(a, b);",
  ECStack.current.lexicalEnvironment
);
ECStack.current.lexicalEnvironment.createBinding("one");
ECStack.current.lexicalEnvironment.setBinding("one", oneFn);

// 3.开始执行代码

// 执行全局代码
ECStack.current.lexicalEnvironment.setBinding("a", 1);

// 3. 开始执行函数one代码
//遇到函数则创建一个新的词法环境
let oneLexicalEnvironment = LexicalEnvironment.NewDeclarativeEnvironment(oneFn.scope);
//创建one函数执行上下文
let oneExecutionContext = new ExecutionContext(oneLexicalEnvironment, global);
//把one函数执行上下文推入执行上下文栈并成为最新的执行上下文
ECStack.push(oneExecutionContext);
// 开始one的编译阶段要等级one函数内的变量
//创建并绑定变量b,执行变量提升
ECStack.current.lexicalEnvironment.createBinding("b");
ECStack.current.lexicalEnvironment.setBinding("b", undefined);
//开始执行函数代码，给变量b赋值为2
ECStack.current.lexicalEnvironment.setBinding("b", 2);
//按作用域链查找a和b变量的值并打印
console.log(
  ECStack.current.lexicalEnvironment.getIdentifierReference("a"),
  ECStack.current.lexicalEnvironment.getIdentifierReference("b")
);
//弹出one执行上下文，回到全局执行上下文，one执行上下文销毁
ECStack.pop();
