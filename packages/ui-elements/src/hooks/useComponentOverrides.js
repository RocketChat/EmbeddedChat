import { useMemo } from 'react';
import useTheme from './useTheme';

const useComponentOverrides = (component, className = '', style = {}) => {
  const { theme } = useTheme();
  const classNames = useMemo(
    () =>
      `${Array.isArray(className) ? className.join(' ') : className} ${
        theme?.components?.[component]?.classNames || ''
      }`,
    [className, component, theme?.components]
  );
  const styleOverrides = useMemo(
    () => ({
      ...style,
      ...((theme?.components && theme?.components[component]?.styleOverrides) ||
        {}),
    }),
    [component, style, theme?.components]
  );

  const configOverrides = useMemo(
    () => ({
      ...((theme?.components &&
        theme?.components[component]?.configOverrides) ||
        {}),
    }),
    [component, theme?.components]
  );

  const variantOverrides = useMemo(
    () => (theme?.variants && theme?.variants[component]) || '',

    [component, theme?.variants]
  );
  return { styleOverrides, classNames, configOverrides, variantOverrides };
};

export default useComponentOverrides;
