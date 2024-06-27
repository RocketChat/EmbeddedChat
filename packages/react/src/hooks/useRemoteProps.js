import { useEffect } from 'react';

const useRemoteProps = (RCInstance, setConfig) => {
  useEffect(() => {
    const getConfig = async () => {
      try {
        const appInfo = await RCInstance.getRCAppInfo();
        if (!appInfo) return;

        const props = appInfo.propConfig;

        if (props && Object.keys(props).length > 0) {
          setConfig((prevConfig) => ({
            ...prevConfig,
            ...Object.keys(props).reduce((acc, key) => {
              if (props[key]) {
                acc[key] = props[key];
              }
              return acc;
            }, {}),
          }));
        }
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    };

    getConfig();
  }, [RCInstance, setConfig]);
};

export default useRemoteProps;
