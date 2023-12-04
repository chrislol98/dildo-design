const { flatData, svgData } = require('./getSvgData');
const babel = require('@babel/core');
const { optimize } = require('svgo');
const fse = require('fs-extra');

const nunjucks = require('nunjucks');

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-spread',
  ],
};

const babelConfigCjs = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-modules-commonjs',
  ],
};

// index

const indexContentEs = (name) => {
  return `export { default as ${name} } from './react-icon/${name}/index';`;
};
const indexContentCjs = (name) => {
  return `export { default as ${name} } from './react-icon-cjs/${name}/index';`;
};

const entryCode = flatData.map((com) => indexContentEs(com.componentName)).join('\n');
const entryCodeCjs = flatData.map((com) => indexContentCjs(com.componentName)).join('\n');

fse.outputFile('../index.es.js', entryCode, (err) => {
  if (err) return;
});
fse.outputFile('../index.js', babel.transform(entryCodeCjs, babelConfigCjs).code, (err) => {
  if (err) return;
});

function generateIcon(cjs) {
  const config = {
    plugins: [
      'removeUnknownsAndDefaults',
      'cleanupAttrs',
      'removeXMLNS',
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeTitle',
      'removeDesc',
      'removeUselessDefs',
      'removeEditorsNSData',
      'removeEmptyAttrs',
      'removeHiddenElems',
      'removeEmptyText',
      'removeEmptyContainers',
      // 'removeViewBox',
      'cleanupEnableBackground',
      'convertStyleToAttrs',
      'convertColors',
      'convertPathData',
      'convertTransform',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill',
      'removeUnusedNS',
      'cleanupIDs',
      'cleanupNumericValues',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      // 'removeRasterImages',
      'mergePaths',
      'convertShapeToPath',
      'sortAttrs',
      'removeDimensions',
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [
            {
              fill: 'none',
            },
            {
              stroke: 'currentColor',
            },
            '{...props}',
          ],
        },
      },
    ],
  };
  flatData.forEach((data, idx) => {
    const svgCode = fse.readFileSync(data.file, 'utf8');
    const svg = optimize(svgCode, { path: data.file, ...config })
      .data.replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/class=/g, 'className=');

    nunjucks.configure({ autoescape: false });
    nunjucks.render(
      './icon.template.nunjucks',
      {
        svg,
        iconName: data.componentName,
        iconClassName: data.name,
      },
      (err, res) => {
        if (err) return;
        console.log(res);
        const code = babel.transform(res, cjs ? babelConfigCjs : babelConfig).code;

        fse.outputFile(
          `../${cjs ? 'react-icon-cjs' : 'react-icon'}/${data.componentName}/index.js`,
          code,
          (err) => {
            if (err) return;
          }
        );
      }
    );
  });
}

generateIcon();
generateIcon(true);
