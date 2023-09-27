module.exports = {
  arrowParens: 'always',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'es5',
  plugins: [
    require.resolve('prettier-plugin-organize-imports'), // import 排序 组合 去除无用
  ],
};
