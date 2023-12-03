// 定义一个名为 ZMPScript 的类
class ZMPScript {
  // 定义一个名为 exec 的异步方法，接受两个参数：name 和 options
  async exec(name, options) {
      // 使用 require 动态加载指定名称的模块（文件），并调用其 setup 方法，传递 options 参数
      await require(`./${name}`).setup(options);
  }
}
// 创建一个 ZMPScript 类的实例，并导出该实例
module.exports = new ZMPScript();