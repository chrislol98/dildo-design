const maps = require('./maps');
const fs = require('fs');
const svgs = Object.keys(maps['zh-CN']);
const path = require('path');

const svgData = {};
const flatData = [];
svgs.forEach((svg) => {
  const dirPath = path.resolve(__dirname, '../svgs', svg);
  if (fs.lstatSync(dirPath).isDirectory()) {
    const dir = fs.readdirSync(dirPath);
    const dirData = {};

    dir.forEach((d) => {
      const files = fs.readdirSync(path.resolve(dirPath, d));
      dirData[d] = files.map((file) => {
        const data = {
          name: file.slice(0, -4),
          // todo
          componentName: file.slice(0, -4),
          file: path.resolve(dirPath, d, file),
        };
        flatData.push(data);
        return data;
      });
    });
  }

  svgData[svg] = dirData;
});

module.exports = {svgData, flatData}
