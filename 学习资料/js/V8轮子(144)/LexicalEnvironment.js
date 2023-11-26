const DeclarativeEnvironmentRecords = require('./DeclarativeEnvironmentRecords');
const ObjectEnvironmentRecords = require('./ObjectEnvironmentRecords');

// 词法环境由一个环境记录项和一个外部词法记录的引用组成
class LexicalEnvironment {
  constructor(environmentRecord, outer) {
    this.environmentRecord = environmentRecord;
    this.outer = outer;
  }
  /**
   * 创建变量
   * @param {*} N 名称
   */
  createBinding(N) {
    return this.environmentRecord.createBinding(N);
  }
  /**
   * 给N设置值V
   * @param {*} N 名称
   * @param {*} V 值
   */
  setBinding(N, V) {
    return this.environmentRecord.setBinding(N, V);
  }
  /**
   * 是否绑定一个变量
   * @param {*} N 名称
   */
  hasBinding(N) {
    return this.environmentRecord.hasBinding(N);
  }
  /**
   * 获取N的值
   * @param {*} N   名称
   */
  getBindingValue(N) {
    return this.environmentRecord.getBindingValue(N);
  }
  /**
   * 返回此词法环境下name的值
   * @param {*} name
   */
  getIdentifierReference(name) {
    let lexicalEnvironment = this;
    do {
      let exists = lexicalEnvironment.hasBinding(name);
      if (exists) {
        return lexicalEnvironment.getBindingValue(name);
      } else {
        lexicalEnvironment = lexicalEnvironment.outer;
      }
    } while (lexicalEnvironment);
  }
  /**
   * 创建新的声明式词法环境
   * @param {*} lexicalEnvironment 父词法环境
   * @returns
   */
  static NewDeclarativeEnvironment(lexicalEnvironment) {
    let envRec = new DeclarativeEnvironmentRecords();
    let env = new LexicalEnvironment(envRec, lexicalEnvironment);

    return env;
  }
  /**
   * 创建新的对象式词法环境
   * @param {*} lexicalEnvironment 父词法环境
   * @returns
   */
  static NewObjectEnvironment(object, lexicalEnvironment) {
    let envRec = new ObjectEnvironmentRecords(object);
    let env = new LexicalEnvironment(envRec, lexicalEnvironment);
    return env;
  }
}
module.exports = LexicalEnvironment;
