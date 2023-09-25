import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
const useComponentOverrides = (component, style = {}) => {
  const theme = useTheme();

  let receivedStyle = useMemo(() => {
    if (Array.isArray(style)) {
      return StyleSheet.flatten(style);
    }
    return style;
  }, [style]);

  const styleOverrides = useMemo(
    () => ({
      ...receivedStyle,
      ...((theme?.components && theme?.components[component]?.styleOverrides) || {}),
    }),
    [receivedStyle, theme?.components?.[component]?.styleOverrides]
  );
  return { styleOverrides };
};

export default useComponentOverrides;
