const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const NpmImportPlugin = require('less-plugin-npm-import');

const {
  DIR_NAME_ASSET,
  DIR_NAME_CJS,
  DIR_NAME_COMPONENT_LIBRARY,
  DIR_NAME_ESM,
  DIR_NAME_SOURCE,
  DIR_NAME_UMD,
  FILENAME_DIST_CSS,
  FILENAME_DIST_LESS,
} = require('../env');

const npmImport = new NpmImportPlugin({ prefix: '~' });
const autoprefix = new LessAutoprefix();
const FILE_ASSET_EXT = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'eot', 'woff', 'woff2'];
const FILE_WATCHED_EXT = FILE_ASSET_EXT.concat(['less', 'css']);
const config = {
  jsEntry: {
    entry: [`${DIR_NAME_SOURCE}/style/index.ts`, `${DIR_NAME_COMPONENT_LIBRARY}/*/style/index.ts`],
    autoInjectArcoDep: true,
    styleSheetExtension: 'less',
  },
  css: {
    entry: [`${DIR_NAME_SOURCE}/**/index.less`, `${DIR_NAME_COMPONENT_LIBRARY}/**/index.less`],
    watch: [
      `${DIR_NAME_SOURCE}/**/*.{${FILE_WATCHED_EXT.join(',')}}`,
      `${DIR_NAME_COMPONENT_LIBRARY}/**/*.{${FILE_WATCHED_EXT.join(',')}}`,
    ],
    watchBase: {},
    output: {
      es: DIR_NAME_ESM,
      cjs: DIR_NAME_CJS,
      dist: {
        path: `${DIR_NAME_UMD}/css`,
        cssFileName: FILENAME_DIST_CSS,
        rawFileName: FILENAME_DIST_LESS,
      },
    },
    compiler: less,
    compilerOptions: {
      paths: ['node_modules'],
      plugins: [npmImport, autoprefix],
      relativeUrls: true,
      javascriptEnabled: true,
    },
  },
};
module.exports = config;
