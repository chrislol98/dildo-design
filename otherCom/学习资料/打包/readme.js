// api 手写webpack
// 11.支持懒加载
// 13.splitChunks 103.13


// api hmr (103.11)
// 不懂，什么写法
// * webpack5
//  * entry:{
//  *   main:{
//  *      import:['webpack/hot/dev-server.js','webpack-dev-server/client/index.js','./src/index.js']
//  *   }
//  * }
// 不懂 客户端的io是谁注入的
// 不懂 compiler.hooks.entryOption.call(options.context,options.entry); 这个不是开始编译吗

// api webpack5源码 （4741Webpack全家桶）  http://zhufengpeixun.com/front/html/1.11.webpack-source.html#t53.%E5%88%9D%E5%A7%8B%E5%8C%96%E9%98%B6%E6%AE%B5


// api emp 163