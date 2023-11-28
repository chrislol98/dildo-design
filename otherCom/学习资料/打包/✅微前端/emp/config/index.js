// 引入 path、webpack 和 WebpackChain 模块
const path = require('path');
const webpack = require('webpack');
const WebpackChain = require('webpack-chain');
// 导出 defineConfig 函数，接收一个配置对象并返回它
exports.defineConfig = (config) => {
  return config;
};
// 导出 getConfig 函数，返回经过处理后的 webpack 配置对象
exports.getConfig = () => {
  // 创建一个 webpack-chain 实例
  const webpackChain = new WebpackChain();
  // 解析 emp-config.js 配置文件，并获取其导出值
  const configPath = path.resolve(process.cwd(), 'emp-config.js');
  const configExport = require(configPath);
  // 对默认配置进行处理，如将 server 属性提取到 devServer 属性中
  const config = processDefault(configExport);
  // 将处理后的配置与 webpack-chain 实例合并
  webpackChain.merge(config);
  // 将合并后的 webpack-chain 实例转换成 webpack 配置对象并返回
  return webpackChain.toConfig();
};
// 处理默认配置的函数，返回处理后的配置对象
function processDefault(configExport) {
  // 将 server 属性提取到 devServer 属性中
  const devServer = configExport.server || {};
  delete configExport.server;
  // 将 empShare 属性的值作为 mfOptions 的一部分，并将 empShare 属性删除
  const mfOptions = {
    filename: 'emp.js',
    ...configExport.empShare,
  };
  delete configExport.empShare;
  // 返回处理后的配置对象
  return {
    context: process.cwd(),
    mode: 'development',
    devtool: false,
    devServer,
    plugin: {
      html: {
        plugin: require('html-webpack-plugin'),
        args: [
          {
            template: path.join(__dirname, '../template/index.html'),
          },
        ],
      },
      mf: {
        plugin: webpack.container.ModuleFederationPlugin,
        args: [mfOptions],
      },
    },
    module: {
      rule: {
        compile: {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: {
            'babel-loader': {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  require.resolve('@babel/preset-react'),
                ],
              },
            },
          },
        },
      },
    },
    ...configExport,
  };
}
