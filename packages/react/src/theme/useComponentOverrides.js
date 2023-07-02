import { useTheme } from '@emotion/react';

const useComponentOverrides = (component) => {
  const theme = useTheme();
  const classNames =
    (theme?.components && theme?.components[component]?.classNames) || '';
  const styleOverrides =
    (theme?.components && theme?.components[component]?.styleOverrides) || {};
  return { styleOverrides, classNames };
};

export default useComponentOverrides;
