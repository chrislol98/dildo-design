import { configure } from 'nunjucks';
import fse from 'fs-extra';
import moment from 'moment';
import axios from 'axios';
import inquirer from 'inquirer';
import { getLastVersion, compareVersion, getRecords, isValidComponent } from './shared';

const nunjucksEnv = configure(__dirname, {
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const typeMap = {
  'New feature': 'feature',
  'Bug fix': 'bugfix',
  Refactoring: 'refactor',
  'Component style change': 'style',
  Enhancement: 'enhancement',
  'Performance improvement': 'enhancement',
  'Typescript definition change': 'typescript',
  'Breaking change': 'attention',
};

const CHANGELOG_DIR = './CHANGELOG.MD';

const changelog = async () => {
  let version;
  if (fse.existsSync('package.json')) {
    try {
      const packageJson = await fse.readFile('package.json', 'utf8');
      const packageData = JSON.parse(packageJson);
      if (packageData.version) {
        version = packageData.version;
      }
    } catch {}
  }

  const answer = await inquirer.prompt({
    type: 'input',
    name: 'version',
    message: 'Please input the version',
    default: version,
    validate(input) {
      return /\d+\.\d+\.\d+(-beta\.\d+)?/.test(input);
    },
  });

  version = answer.version;

  const currentContent = fse.readFileSync(CHANGELOG_DIR, 'utf8');
  const lastVersion = getLastVersion(currentContent);

  if (version === lastVersion || compareVersion(version, lastVersion) < 1) {
    const answer = await inquirer.prompt({
      type: 'input',
      name: 'version',
      message: `This version is already existed or lower than last version, please reenter`,
      validate(input) {
        return /\d+\.\d+\.\d+(-beta\.\d+)?/.test(input) && input !== lastVersion;
      },
    });
    version = answer.version;
  }

  await getList({ version });
};

async function getList({ version }) {
  const res = await axios.get(
    `https://api.github.com/search/issues?accept=application/vnd.github.v3+json&q=repo:arco-design/arco-design+is:pr+is:merged+milestone:${version}`
  );

  let data = res?.data?.items;

  const changelog = {
    version,
    date: moment().format('YYYY-MM-DD'),
    list: [],
  };
  for (const item of data) {
    const records = getRecords(item, typeMap);
    changelog.list.push(...records);
  }

  if (changelog.list.length > 0) {
    const emits = await getEmitsFromChangelog(changelog);

    for (const item of emits) {
      await appendChangelog(item);
    }
  } else {
    console.log('No update information found');
  }
}

export default changelog;

const appendChangelog = (emit) => {
  const { filename, template, data } = emit;
  const content = nunjucksEnv.render(template, data);
  try {
    fse.accessSync(filename);
    const origin = fse.readFileSync(filename, 'utf8');
    let originContent = origin;
    let hasFm = false;
    if (origin.match(/^---\nchangelog:\s*true\n---\n\n/)) {
      hasFm = true;
      originContent = origin.replace(/^---\nchangelog:\s*true\n---\n\n/, '');
    }
    const result = (hasFm ? '---\nchangelog: true\n---\n\n' : '') + content + originContent;

    fse.writeFileSync(filename, result);
  } catch {
    fse.writeFileSync(filename, content);
  }
};

const getEmitsFromChangelog = async (changelog) => {
  const allCN = {};
  const addEN = {};
  const componentCN = {};
  const componentEN = {};

  for (const item of changelog.list) {
    if (!isValidComponent(item.component)) {
      const answer = await inquirer.prompt({
        type: 'input',
        name: 'component',
        message: `The component name '${item.component}' is invalid, please input the new name.[${item.mrId}]`,
        validate(input) {
          return isValidComponent(input);
        },
      });
      item.component = answer.component;
    }

    const contentCN = `${item['changelog(cn)']}([#${item.mrId}](${item.mrURL}))`;
    const contentEN = `${item['changelog(en)']}([#${item.mrId}](${item.mrURL}))`;
    addAll({ ...item, content: contentCN }, allCN);
    addAll({ ...item, content: contentEN }, addEN);
    addComponent({ ...item, content: contentCN }, componentCN);
    addComponent({ ...item, content: contentEN }, componentEN);
  }

  const emits = [
    {
      filename: 'site/docs/version_v2.zh-CN.md',
      template: 'template/main.zh-CN.njk',
      data: { version: changelog.version, date: changelog.date, ...allCN },
    },
    {
      filename: 'site/docs/version_v2.en-US.md',
      template: 'template/main.en-US.njk',
      data: { version: changelog.version, date: changelog.date, ...addEN },
    },
  ];

  for (const component of Object.keys(componentCN)) {
    let filepath = `components/${component}/__changelog__/index.zh-CN.md`;
    if (/common/i.test(component)) {
      filepath = 'site/docs/changelog.common.zh-CN.md';
    } else if (/icon/.test(component)) {
      filepath = 'site/src/pages/icon/md/__changelog__/index.zh-CN.md';
    }
    emits.push({
      filename: filepath,
      template: 'template/main.zh-CN.njk',
      data: {
        version: changelog.version,
        date: changelog.date,
        ...componentCN[component],
      },
    });
  }
  for (const component of Object.keys(componentEN)) {
    let filepath = `./components/${component}/__changelog__/index.en-US.md`;
    if (/common/i.test(component)) {
      filepath = 'site/docs/changelog.common.en-US.md';
    } else if (/icon/.test(component)) {
      filepath = 'site/src/pages/icon/md/__changelog__/index.en-US.md';
    }
    emits.push({
      filename: filepath,
      template: 'template/main.en-US.njk',
      data: {
        version: changelog.version,
        date: changelog.date,
        ...componentEN[component],
      },
    });
  }

  return emits;
};

const addAll = (data, changelog) => {
  if (!changelog[data.type]) {
    changelog[data.type] = [];
  }
  changelog[data.type].push(data.content);
};

const addComponent = (data, changelog) => {
  const component = data.component || 'common';
  if (!changelog[component]) {
    changelog[component] = {};
  }
  if (!changelog[component][data.type]) {
    changelog[component][data.type] = [];
  }
  changelog[component][data.type].push(data.content);
};
