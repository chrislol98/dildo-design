const ObjectEnvironmentRecords = require('./ObjectEnvironmentRecords');
const LexicalEnvironment = require('./LexicalEnvironment');
const ExecutionContext = require('./ExecutionContext');
const ExecutionContexts = require('./ExecutionContexts');
const FunctionInstance = require('./FunctionInstance');

//创建执行上下文栈
const ECStack = new ExecutionContexts();
//创建全局环境记录对象
const globalEnvironmentRecord = new ObjectEnvironmentRecords(global);
//创建全局环境
const globalLexicalEnvironment = new LexicalEnvironment(globalEnvironmentRecord, null);
//创建全局执行上下文
let globalExecutionContext = new ExecutionContext(globalLexicalEnvironment, global);
//把全局执行上下文放入执行上下文栈
ECStack.push(globalExecutionContext);

//创建a变量并初始化为undefined
ECStack.current.variableEnvironment.createBinding('a');
ECStack.current.variableEnvironment.setBinding('a', undefined);
//创建fn变量并赋值为函数
let oneFn = new FunctionInstance(
  'one',
  'var b = 2;\nconsole.log(a, b);',
  ECStack.current.lexicalEnvironment
);
ECStack.current.variableEnvironment.createBinding('one');
ECStack.current.variableEnvironment.setBinding('one', oneFn);

//开始执行代码,给a变量赋值为1
ECStack.current.variableEnvironment.setBinding('a', 1);
//遇到函数则创建一个新的词法环境
let oneLexicalEnvironment = LexicalEnvironment.NewDeclarativeEnvironment(oneFn.scope);
//创建one函数执行上下文
let oneExecutionContext = new ExecutionContext(oneLexicalEnvironment, global);
//把one函数执行上下文推入执行上下文栈并成为最新的执行上下文
ECStack.push(oneExecutionContext);

//创建并绑定变量b,执行变量提升
ECStack.current.variableEnvironment.createBinding('b');
ECStack.current.variableEnvironment.setBinding('b', undefined);
//开始执行函数代码，给变量b赋值为2
ECStack.current.variableEnvironment.setBinding('b', 2);

////////////////////////////////////////////////////////////

//备份当前的词法作用域
let oldEnv = ECStack.current.lexicalEnvironment;
//创建新的词法环境
let blockEnv = LexicalEnvironment.NewDeclarativeEnvironment(oldEnv);
blockEnv.createBinding('c');
blockEnv.setBinding('c', { type: 'let', uninitialized: true });
//让blockEnv成为当前执行上下文的词法环境
ECStack.current.lexicalEnvironment = blockEnv;
//开始执行块级作用域中的代码
ECStack.current.lexicalEnvironment.setBinding('c', 3);
console.log(
  ECStack.current.lexicalEnvironment.getIdentifierReference('a'),
  ECStack.current.lexicalEnvironment.getIdentifierReference('b'),
  ECStack.current.lexicalEnvironment.getIdentifierReference('c')
);

// 词法环境回退
ECStack.current.lexicalEnvironment = oldEnv;

//备份当前的词法作用域
oldEnv = ECStack.current.lexicalEnvironment;
//创建新的词法环境
blockEnv = LexicalEnvironment.NewDeclarativeEnvironment(oldEnv);
blockEnv.createBinding('c');
blockEnv.setBinding('c', { type: 'let', uninitialized: true });
//让blockEnv成为当前执行上下文的词法环境
ECStack.current.lexicalEnvironment = blockEnv;
//开始执行块级作用域中的代码
ECStack.current.lexicalEnvironment.setBinding('c', 4);
console.log(
  ECStack.current.lexicalEnvironment.getIdentifierReference('a'),
  ECStack.current.lexicalEnvironment.getIdentifierReference('b'),
  ECStack.current.lexicalEnvironment.getIdentifierReference('c')
);
ECStack.current.lexicalEnvironment = oldEnv;
ECStack.pop();
