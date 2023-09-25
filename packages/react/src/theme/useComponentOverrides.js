import { useTheme } from '@emotion/react';
import { useMemo } from 'react';

const useComponentOverrides = (component, className = '', style = {}) => {
  const theme = useTheme();
  const classNames = useMemo(
    () =>
      `${Array.isArray(className) ? className.join(' ') : className} ${
        theme?.components?.[component]?.classNames || ''
      }`,
    [className, theme?.components?.[component]?.classNames]
  );
  const styleOverrides = useMemo(
    () => ({
      ...style,
      ...((theme?.components && theme?.components[component]?.styleOverrides) ||
        {}),
    }),
    [style, theme?.components?.[component]?.styleOverrides]
  );
  return { styleOverrides, classNames };
};

export default useComponentOverrides;
