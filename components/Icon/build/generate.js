const { flatData } = require('./getSvgData');
const babel = require('@babel/core');
const fse = require('fs-extra');

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

function generateIcon() {
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
  flatData.forEach((data, idx) => {});
}
