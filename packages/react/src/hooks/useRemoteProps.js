import { useEffect, useState } from 'react';

const useRemoteProps = (remoteOpt, RCInstance, setConfig) => {
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const getConfig = async () => {
      try {
        if (!remoteOpt) return;

        const appInfo = await RCInstance.getRCAppInfo();

        if (appInfo) {
          const props = appInfo.propConfig;

          if (props && Object.keys(props).length > 0) {
            setConfig((prevConfig) => ({
              ...prevConfig,
              ...Object.keys(props).reduce((acc, key) => {
                if (props[key] !== '') {
                  acc[key] = props[key];
                }
                return acc;
              }, {}),
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching remote config:', error);
      } finally {
        setIsSynced(true);
      }
    };

    getConfig();
  }, [RCInstance, remoteOpt, setConfig]);

  return isSynced;
};

export default useRemoteProps;
