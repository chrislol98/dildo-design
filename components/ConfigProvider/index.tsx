import * as React from 'react';
import defaultLocale from '../locale/default';
import { useMergeProps, omit } from '../shared';
const defaultProps = {
  locale: defaultLocale,
};

export const ConfigContext = React.createContext<any>({ ...defaultProps });

function ConfigProvider(props) {
  props = useMergeProps(props, defaultProps, {});
  const { locale } = props;

  const config = {
    ...omit(props, ['children']),
  };

  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
}

ConfigProvider.displayName = 'ConfigProvider';

export default ConfigProvider;
