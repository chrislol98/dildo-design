#!/usr/bin/env node
const { version } = require('./package.json');
const { program } = require('commander');
const build = require('./build');
program.version(version).name('met-cli');

program
  .command('build:es')
  .description('build es module')
  .action(() => {
    build.component();
  });

program
  .command('build:cjs')
  .description('build es module')
  .action(() => {
    build.component();
  });

program
  .command('build:css')
  .description('build es module')
  .action(() => {
    build.css();
  });

program.parse(process.argv);
