const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const gulpIf = require('gulp-if');
const { styleConfig } = require('../config');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const mergeStream = require('merge-stream');
const { FILENAME_STYLE_ENTRY_CSS, BUILD_ENV_MODE } = require('../env');
const { css: cssConfig, jsEntry: jsEntryConfig, asset: assetConfig } = styleConfig;
/** 1. 编译 Table/style/index.less   2. 发送到 es 和 lib 文件夹 */
function compileLess() {
  const destDirs = [cssConfig.output.es, cssConfig.output.cjs].filter((path) => path);

  if (destDirs.length) {
    let stream = gulp.src(cssConfig.entry, { allowEmpty: true });

    stream = stream.pipe(cssConfig.compiler(cssConfig.compilerOptions));

    stream = stream.pipe(cleanCSS());

    destDirs.forEach((dir) => {
      stream = stream.pipe(gulp.dest(dir));
    });

    return stream.on('error', (error) => {
      console.error(error);
    });
  }

  return Promise.resolve(null);
}
/** 1. 编译 Table/style/index.ts 2. 发送到 es lib 文件夹 */
async function handleStyleJSEntry() {
  await compileCssJsEntry({
    styleJSEntry: jsEntryConfig.entry,
    outDirES: cssConfig.output.es,
    outDirCJS: cssConfig.output.cjs,
  });
}


async function compileCssJsEntry({ styleJSEntry, outDirES, outDirCJS }) {
  const compile = (module) => {
    return new Promise((resolve, reject) => {
      mergeStream(
        styleJSEntry.map((entry) =>
          gulp.src(entry, {
            allowEmpty: true,
            base: entry.replace(/(\/\*{1,2})*\/style\/index\.[jt]s$/, ''),
          })
        )
      )
        .pipe(replace(`.${jsEntryConfig.styleSheetExtension}`, '.css'))
        .pipe(
          replace(/import\s+'(.+(?:\/style)?)(?:\/index.[jt]s)?'/g, (_, $1) => {
            const suffix = $1.endsWith('/style') ? '/css.js' : '';
            return module === 'es' ? `import '${$1}${suffix}'` : `require('${$1}${suffix}')`;
          })
        )
        .pipe(
          rename(function (path) {
            const [basename, extname] = FILENAME_STYLE_ENTRY_CSS.split('.');
            path.basename = basename;
            path.extname = `.${extname}`;
          })
        )
        .pipe(gulp.dest(module === 'es' ? outDirES : outDirCJS))
        .on('end', resolve)
        .on('error', reject);
    });
  };

  if (Array.isArray(styleJSEntry) && styleJSEntry.length) {
    try {
      const asyncTasks = [];
      if (fs.pathExistsSync(outDirES)) {
        asyncTasks.push(compile('es'));
      }
      if (fs.pathExistsSync(outDirCJS)) {
        asyncTasks.push(compile('cjs'));
      }
      await Promise.all(asyncTasks);
    } catch (error) {
      console.error(error);
    }
  }
}
/** generate dist/index.less */
function distLess(cb) {
  const { path: distPath, rawFileName } = cssConfig.output.dist;
  let entries = [];

  cssConfig.entry.forEach((e) => {
    entries = entries.concat(glob.sync(e));
  });

  if (entries.length) {
    const texts = [];

    entries.forEach((entry) => {
      // Remove the first level directory
      const esEntry = cssConfig.output.es + entry.slice(entry.indexOf('/'));
      const relativePath = path.relative(distPath, esEntry);
      const text = `@import "${relativePath}";`;

      if (esEntry.startsWith(`${cssConfig.output.es}/style`)) {
        texts.unshift(text);
      } else {
        texts.push(text);
      }
    });

    fs.outputFileSync(`${distPath}/${rawFileName}`, texts.join('\n'));
  }

  cb();
}

/** dist/index.less => dist/index.css */
function distCss(isDev) {
  const { path: distPath, rawFileName, cssFileName } = cssConfig.output.dist;
  const needCleanCss = !isDev && (!BUILD_ENV_MODE || BUILD_ENV_MODE === 'production');

  let stream = gulp.src(`${distPath}/${rawFileName}`, { allowEmpty: true });

  stream = stream.pipe(cssConfig.compiler(cssConfig.compilerOptions));

  return stream
    .pipe(
      replace(
        new RegExp(`(\.{2}\/)+${cssConfig.output.es}`, 'g'),
        path.relative(cssConfig.output.dist.path, assetConfig.output)
      )
    )
    .pipe(gulpIf(needCleanCss, cleanCSS()))
    .pipe(rename(cssFileName))
    .pipe(gulp.dest(distPath))
    .on('error', (error) => {
      console.error(error);
    });
}
module.exports = function css() {
  return new Promise((resolve) => {
    gulp.series(
      gulp.parallel(compileLess, handleStyleJSEntry),
      gulp.parallel(distLess, distCss.bind(null, false)),
      gulp.parallel(() => resolve(null))
    )(null);
  });
};
