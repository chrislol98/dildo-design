const tsc = require('node-typescript-compiler');
const {
  PROCESS_ENV_BUILD_ES,
  PROCESS_ENV_BUILD_CJS,
  PROCESS_ENV_BUILD_BABEL,
  CWD,
} = require('../env');
const { transform } = require('@babel/core');
const path = require('path');
const fs = require('fs-extra');

const component = () => {
  if (PROCESS_ENV_BUILD_BABEL) {
    withBabel();
  } else {
    withTsc();
  }
};

const withTsc = () => {
  const tsConfig = getTsConfig();
  if (PROCESS_ENV_BUILD_ES) {
    tsConfig.module = 'ESNext';
  } else if (PROCESS_ENV_BUILD_CJS) {
    tsConfig.module = 'CommonJS';
  }
  return tsc.compile({ ...tsConfig });
};

const withBabel = () => {
  const tsConfig = getTsConfig();
  return tsc.compile({ ...tsConfig });
};

const getTsConfig = () => {
  const tsConfigPath = path.resolve(CWD, 'tsconfig.json');
  let tsConfig = {};
  if (fs.pathExistsSync(tsConfigPath)) {
    tsConfig = require(tsConfigPath);
  }
  return tsConfig;
};
module.exports = component;
