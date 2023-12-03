#!/usr/bin/env node
const { version } = require('./package.json');
const program = require('commander');
const build = require('./build');
program.version(version).name('met-cli');

program
  .command('build:es')
  .description('build es module')
  .action(() => {
    build.run();
  });

program
  .command('build:cjs')
  .description('build es module')
  .action(() => {
    build.run();
  });

program.parse(process.argv);
