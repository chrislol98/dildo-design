import * as React from 'react';
import defaultLocale from '../locale/default';
import { useMergeProps, omit, isObject } from '../shared';
import { lighten } from './shared';
const defaultProps = {
  locale: defaultLocale,
  prefixCls: 'dildo',
};

const colorList = {
  primaryColor: {
    default: '--arcoblue-6',
    hover: '--arcoblue-5',
    active: '--arcoblue-7',
  },
  successColor: {
    default: '--green-6',
    hover: '--green-5',
    active: '--green-7',
  },
  infoColor: {
    default: '--arcoblue-6',
    hover: '--arcoblue-5',
    active: '--arcoblue-7',
  },
  warningColor: {
    default: '--orangered-6',
    hover: '--orangered-5',
    active: '--orangered-7',
  },
  dangerColor: {
    default: '--red-6',
    hover: '--red-5',
    active: '--red-7',
  },
};

function setTheme(theme) {
  if (theme && isObject(theme)) {
    const root = document.body;
    Object.keys(colorList).forEach((color) => {
      if (theme[color]) {
        root.style.setProperty(colorList[color].default, lighten(theme[color], 0));

        root.style.setProperty(colorList[color].hover, lighten(theme[color], 10));

        root.style.setProperty(colorList[color].active, lighten(theme[color], -10));
      }
    });
  }
}
export const ConfigContext = React.createContext<any>({ ...defaultProps });

function ConfigProvider(props) {
  props = useMergeProps(props, defaultProps, {});
  const { theme } = props;
  React.useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const config = {
    ...omit(props, ['children']),
  };

  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
}

ConfigProvider.displayName = 'ConfigProvider';

export default ConfigProvider;
