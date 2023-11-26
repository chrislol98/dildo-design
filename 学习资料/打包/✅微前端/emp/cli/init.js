// 导入依赖模块
const { createSpinner } = require('nanospinner');
const git = require('git-promise');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 定义项目模板的URL
const templates = {
    'remote': `https://gitee.com/zhufengpeixun/remote.git`,
    'host': `https://gitee.com/zhufengpeixun/host.git`,
};

// 定义 Init 类
class Init {
    templates = templates
    // 检查传入的URL是否是HTTP地址，并返回数据
    async checkData(url) {
        if (/^http(s)?:\/\/.+/.test(url)) {
            const { data } = await axios.get(url);
            return data;
        } else {
            const filepath = path.join(process.cwd(), url);
            this.templates = require(filepath);
        }
    }
    // 设置模板
    async setup(options) {
        if (typeof options.data === 'string') {
            const data = await this.checkData(options.data);
            if (data) {
                this.templates = data;
            }
        }
        await this.selectTemplate();
    }
    // 选择模板
    async selectTemplate() {
        const inquirer = await (await import('inquirer')).default;
        let answers = await inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: '请输入项目名:',
            default: function () {
                return 'zmp-project';
            }
        }, {
            type: 'list',
            name: 'template',
            message: '请选择模板:',
            choices: Object.keys(this.templates)
        }]);
        let downLoadUrl = this.templates[answers.template];
        const downLoadName = answers.name;
        await this.downloadRepo(downLoadUrl, downLoadName);
    }
    // 下载仓库
    async downloadRepo(repoPath, localPath) {
        const spinner = createSpinner().start();
        spinner.start({ text: `[downloading]\n` });
        await git(`clone ${repoPath} ./${localPath}`);
        fs.removeSync(`./${localPath}/.git`);
        spinner.success({
            text: ` cd ${localPath} && npm i && npm run dev`
        });
    }
}
// 导出 Init 类的实例
module.exports = new Init();