#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');
const cli = require('../cli');
program.version(pkg.version, '-v, --version').usage('<command> [options]');
program.command('init')
    .description('初始化项目')
    .option('-d, --data [data]', 'JSON数据 http地址或者文件路径相对、绝对路径')
    .action((options) => {
        cli.exec('init', options);
    });
program.command('dev')
    .description('Dev Server')
    .action(async (options) => {
       cli.exec('dev',options);
    });
program.parse(process.argv);