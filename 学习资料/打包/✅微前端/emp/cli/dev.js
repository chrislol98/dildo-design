// 引入 webpack-dev-server 模块
const WebpackDevServer = require('webpack-dev-server'); 
// 引入 webpack 模块
const webpack = require('webpack'); 
 // 引入 getConfig 方法，用于获取 webpack 配置
const { getConfig } = require('../config');
class devServer {
    // 定义异步的 setup 方法
  async setup() { 
        // 调用 setServer 方法来设置服务器
    await this.setServer();
  }
    // 定义异步的 setServer 方法
  async setServer() { 
        // 通过 getConfig 方法获取 webpack 配置
    const config = getConfig(); 
        // 使用 webpack 函数创建一个编译器实例
    const compiler = webpack(config); 
        // 创建一个新的 webpack-dev-server 实例，传入 devServer 配置和编译器实例
    this.server = new WebpackDevServer(config.devServer, compiler); 
        // 启动 webpack-dev-server
    this.server.start(); 
  }
}
// 导出 devServer 类的一个实例
module.exports = new devServer(); 