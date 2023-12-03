// 导入 'webpack-chain' 模块，它是一个构造函数，用于创建配置 API
const Config = require('./webpack-chain');
// 实例化一个新的配置 API 对象
const config = new Config();
// 使用链式 API 修改配置
config
    // 添加一个入口点
    .entry('index')
    // 为入口点添加文件路径
    .add('src/index.js')
    // 结束对当前入口点的操作并返回 config 实例
    .end()
    // 修改输出设置
    .output
    // 设置输出目录
    .path('dist')
    // 设置输出文件名
    .filename('[name].bundle.js');
// 将配置转换为 webpack 可以使用的配置对象
const options = config.toConfig();
// 打印配置对象
console.log(options);

/**
{
  entry: { index: [ 'src/index.js' ] },
  output: { path: 'dist', filename: '[name].bundle.js' }
}
 */