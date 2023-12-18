const componentList = [
  'common',
  'Common',
  'Alert',
  'Anchor',
  'Affix',
  'AutoComplete',
  'Avatar',
  'BackTop',
  'Badge',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'Carousel',
  'Cascader',
  'Checkbox',
  'Collapse',
  'Comment',
  'ConfigProvider',
  'DatePicker',
  'Descriptions',
  'Divider',
  'Drawer',
  'Dropdown',
  'Empty',
  'Form',
  'Grid',
  'Icon',
  'Input',
  'InputTag',
  'InputNumber',
  'Layout',
  'Link',
  'List',
  'Message',
  'Menu',
  'Modal',
  'Notification',
  'PageHeader',
  'Pagination',
  'Popconfirm',
  'Popover',
  'Portal',
  'Progress',
  'Radio',
  'Rate',
  'ResizeBox',
  'Result',
  'Select',
  'Skeleton',
  'Slider',
  'Space',
  'Spin',
  'Statistic',
  'Steps',
  'Switch',
  'Table',
  'Tabs',
  'Tag',
  'Timeline',
  'TimePicker',
  'Tooltip',
  'Transfer',
  'Tree',
  'TreeSelect',
  'Trigger',
  'Typography',
  'Upload',
  'Mentions',
  'Image',
];

export const isValidComponent = (component) => {
  return componentList.includes(component);
};

const getVersionNumber = (version) => {
  if (!version) {
    return 0;
  }
  switch (version) {
    case 'alpha':
      return -3;
    case 'beta':
      return -2;
    case 'rc':
      return -1;
    default:
      return parseInt(version);
  }
};

export const compareVersion = (v1, v2) => {
  const mainArray1 = v1.split('-');
  const mainArray2 = v2.split('-');
  // Major version
  const array1 = mainArray1[0].split('.');
  const array2 = mainArray2[0].split('.');
  const maxL = Math.max(array1.length, array2.length);
  for (let i = 0; i < maxL; i++) {
    const v1 = getVersionNumber(array1[i]);
    const v2 = getVersionNumber(array2[i]);
    if (v1 !== v2) {
      return v1 > v2 ? 1 : -1;
    }
  }

  // Beta part
  const subArray1 = (mainArray1[1] ?? '').split('.');
  const subArray2 = (mainArray2[1] ?? '').split('.');
  const maxSL = Math.max(subArray1.length, subArray2.length);
  for (let i = 0; i < maxSL; i++) {
    const v1 = getVersionNumber(subArray1[i]);
    const v2 = getVersionNumber(subArray2[i]);
    if (v1 !== v2) {
      return v1 > v2 ? 1 : -1;
    }
  }

  return 0;
};

export const getRecords = (mr, typeMap) => {
  const content = mr.body.replace(/\r\n/g, '\n');

  const records = [];

  const typeRule = new RegExp('##\\s+Types of changes.+?\\[[xX]]\\s+(.+?)\\n', 's');

  // New feature
  //  Bug fix
  //  Enhancement
  //  Documentation change
  //  Coding style change
  //  Component style change
  //  Refactoring
  //  Test cases
  //  Continuous integration
  //  Typescript definition change
  //  Breaking change
  //  Others

  // 第一个捕获分组
  const typeString = (content.match(typeRule)?.[1] ?? '').trim();

  const type = typeString && typeMap[typeString];

  const rule = new RegExp(
    // Table title
    '##\\s+Changelog\\n\\n' +
      // Table title
      '\\s*\\|(.+)\\|\\s*\\n' +
      // Alignment info
      '\\s*\\|(?:[-: ]+[-| :]*)\\|\\s*\\n' +
      // Table content
      '((?:\\s*\\|.*\\|\\s*(?:\\n|$))*)'
  );

  const matchResult = content.match(rule);
  if (matchResult) {
    //  Component | Changelog(CN) | Changelog(EN) | Related issues
    const titles = matchResult[1].split('|').map((item) => item.toLowerCase().trim());
    // |     Watermark      |     修复 `Watermark` 旋转后文字形变的 bug。          |       Fix the bug of text deformation after `Watermark` is rotated.        |      close #2436           |

    const lines = matchResult[2].split('\n').filter((value) => Boolean(value.trim()));
    for (const line of lines) {
      const items = line
        .split('|')
        .slice(1)
        .map((value) => value.trim());
      const data = titles.reduce(
        (data, title, index) => {
          switch (title) {
            case 'related issues': {
              const match = (items[index] ?? '').match(/#\d+/g);
              if (match) {
                data.issue = match.map((item) => item.slice(1));
              }
              break;
            }
            default:
              data[title] = items[index];
          }
          return data;
        },
        {
          mrId: mr.number,
          mrURL: mr.html_url,
          type: type,
        }
      );
      records.push(data);
    }
  }

  return records;
};

export const getLastVersion = (content) => {
  const match = content.match(/## (\d+\.\d+\.\d+(-beta\.\d+)?)/);
  if (match) {
    return match[1];
  }
};

export const getBetaVersions = (content) => {
  const matches = Array.from(content.matchAll(/## (\d+\.\d+\.\d+(-beta\.\d+)?)/g));
  const versions = [];
  for (const item of matches) {
    if (/beta/.test(item[1])) {
      versions.push(item[1]);
    } else {
      break;
    }
  }
  return versions;
};
