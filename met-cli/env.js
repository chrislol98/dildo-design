const { BUILD_ENV_MODE, PROCESS_ENV_BUILD_ES, PROCESS_ENV_BUILD_CJS, PROCESS_ENV_BUILD_BABEL } =
  process.env;

module.exports = {
  BUILD_ENV_MODE,
  PROCESS_ENV_BUILD_ES,
  PROCESS_ENV_BUILD_CJS,
  PROCESS_ENV_BUILD_BABEL,

  CWD: process.cwd(),

  DIR_NAME_ESM: 'es',

  DIR_NAME_CJS: 'lib',

  DIR_NAME_UMD: 'dist',

  DIR_NAME_ICON: 'icon',

  DIR_NAME_SITE: 'site',

  DIR_NAME_TEST: 'tests',

  DIR_NAME_SOURCE: 'src',

  DIR_NAME_ASSET: 'asset',

  DIR_NAME_DEMO: 'demo',

  DIR_NAME_COMPONENT_LIBRARY: 'components',

  FILENAME_DIST_LESS: 'index.less',

  FILENAME_DIST_CSS: 'index.css',

  FILENAME_STYLE_ENTRY_RAW: 'index.js',

  FILENAME_STYLE_ENTRY_CSS: 'css.js',

  FILENAME_README: 'README.md',

  ARCO_LIBRARY_PACKAGE_NAME_REACT: '@arco-design/web-react',
};
