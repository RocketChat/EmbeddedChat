import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { ChromePicker } from 'react-color';
import { getColorMangerStyles } from './ThemeLab.styles';
import debounce from 'lodash/debounce';

const ColorPicker = ({ color, onChange }) => {
  return (
    <ChromePicker
      color={color}
      disableAlpha={true}
      onChange={(updatedColor) => onChange(updatedColor.hsl)}
    />
  );
};

const ColorManager = () => {
  const { theme, mode, setTheme } = useTheme();
  const styles = getColorMangerStyles(theme);
  const [visiblePicker, setVisiblePicker] = useState(null);
  const [lightColors, setLightColors] = useState(theme.schemes.light);
  const [darkColors, setDarkColors] = useState(theme.schemes.dark);
  const pickerRef = useRef(null);

  const debouncedSetTheme = useMemo(
    () =>
      debounce((newLightColors, newDarkColors) => {
        const updatedTheme = {
          ...theme,
          schemes: {
            ...theme.schemes,
            light: newLightColors,
            dark: newDarkColors,
          },
        };
        setTheme(updatedTheme);
      }, 300),
    [theme, setTheme]
  );

  const handleColorChange = useCallback(
    (key, hsl) => {
      const updatedColor = `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`;
      if (mode === 'light') {
        const newLightColors = { ...lightColors, [key]: updatedColor };
        setLightColors(newLightColors);
        debouncedSetTheme(newLightColors, darkColors);
      } else {
        const newDarkColors = { ...darkColors, [key]: updatedColor };
        setDarkColors(newDarkColors);
        debouncedSetTheme(lightColors, newDarkColors);
      }
    },
    [mode, lightColors, darkColors, debouncedSetTheme]
  );

  const togglePicker = (key) => {
    setVisiblePicker((prevKey) => (prevKey === key ? null : key));
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setVisiblePicker(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <Box>
      {Object.entries(colors).map(([key, value]) => (
        <Box key={key} css={styles.pickerContainer}>
          <Box is="span">{key}:</Box>
          <Box
            style={{
              width: 20,
              height: 20,
              borderRadius: '0.2rem',
              border: `1px solid ${colors.border}`,
              backgroundColor: value,
              margin: '0 10px',
              cursor: 'pointer',
            }}
            onClick={() => togglePicker(key)}
          />
          {visiblePicker === key && (
            <Box css={styles.colorPicker} ref={pickerRef}>
              <ColorPicker
                color={value}
                onChange={(newColor) => handleColorChange(key, newColor)}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ColorManager;
