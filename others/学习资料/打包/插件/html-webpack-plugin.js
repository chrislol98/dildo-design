const path = require('path');
const fs = require('fs');
class HtmlWebpackPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('SimplifiedHtmlWebpackPlugin', (compilation, callback) => {
            // 读取模板文件
            fs.readFile(this.options.template, 'utf8', (err, data) => {
                if (err) throw err;
                // 替换模板中的占位符
                const scriptTags = Object.keys(compilation.assets)
                    .filter(file => file.endsWith('.js'))
                    .map(file => `<script defer src="${file}"></script>`)
                    .join('\n');
                const html = data.replace('</head>', `${scriptTags}\n</head>`);
                // 将生成的 HTML 添加到 Webpack 的输出中
                compilation.assets['index.html'] = {
                    source: () => html,
                    size: () => html.length
                };

                callback();
            });
        });
    }
}
module.exports = HtmlWebpackPlugin;