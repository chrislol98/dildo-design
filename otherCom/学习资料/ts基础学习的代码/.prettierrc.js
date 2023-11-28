module.exports = {
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  bracketSameLine: true, // 多属性html标签的‘>’折行放置
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
  htmlWhitespaceSensitivity: 'ignore', // 对HTML全局空白不敏感
  insertPragma: false, // 是否在已被prettier格式化的文件顶部加上标注
  jsxSingleQuote: true, // 是否在jsx中使用单引号
  printWidth: 120, // 单行长度
  proseWrap: 'preserve', // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  requirePragma: false, // 无需顶部注释即可格式化
  semi: false, // 句末不使用分号
  singleQuote: true, // 使用单引号
  tabWidth: 2, // 缩进长度
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  useTabs: false, // 是否使用空格代替tab缩进
  vueIndentScriptAndStyle: false, // 不对vue中的script及style标签缩进
};
