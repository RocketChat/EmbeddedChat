import JSON5 from 'json5';

export const overrideECProps = (prevConfig, remoteConfig) => {
  if (!remoteConfig || Object.keys(remoteConfig).length === 0) {
    return prevConfig;
  }

  const parseThemeString = (str) => {
    try {
      return JSON5.parse(str);
    } catch (e) {
      console.error('Failed to parse theme: ', e);
      return null;
    }
  };

  const updatedConfig = {
    ...prevConfig,
    ...Object.keys(remoteConfig).reduce((acc, key) => {
      if (remoteConfig[key] !== '') {
        if (key === 'theme') {
          const parsedTheme = parseThemeString(remoteConfig[key]);
          if (parsedTheme) {
            acc[key] = parsedTheme;
          } else {
            acc[key] = prevConfig[key];
          }
        } else {
          acc[key] = remoteConfig[key];
        }
      }
      return acc;
    }, {}),
  };

  return updatedConfig;
};
