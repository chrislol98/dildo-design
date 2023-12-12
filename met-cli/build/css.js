import gulp from 'gulp';
import { styleConfig } from '../config';
import cleanCSS from 'gulp-clean-css';

const { css: cssConfig } = styleConfig;

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
export default function css() {
  return new Promise((res) => {
    gulp.series(gulp.parallel(compileLess, handleStyleJSEntry))((null));
  });
}
