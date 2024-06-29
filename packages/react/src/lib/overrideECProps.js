export const overrideECProps = (prevConfig, remoteConfig) => {
  if (!remoteConfig || Object.keys(remoteConfig).length === 0) {
    return prevConfig;
  }

  const updatedConfig = {
    ...prevConfig,
    ...Object.keys(remoteConfig).reduce((acc, key) => {
      if (remoteConfig[key] !== '') {
        acc[key] = remoteConfig[key];
      }
      return acc;
    }, {}),
  };

  return updatedConfig;
};
