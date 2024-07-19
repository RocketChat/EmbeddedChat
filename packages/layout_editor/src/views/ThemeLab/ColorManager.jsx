import React, { useState, useRef, useEffect } from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { ChromePicker } from 'react-color';
import { getColorMangerStyles } from './ThemeLab.styles';

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
  const { theme, mode } = useTheme();
  const styles = getColorMangerStyles(theme);
  const [visiblePicker, setVisiblePicker] = useState(null);
  const [lightColors, setLightColors] = useState(theme.schemes.light);
  const [darkColors, setDarkColors] = useState(theme.schemes.dark);
  const pickerRef = useRef(null);

  const handleColorChange = (key, hsl) => {
    if (mode === 'light') {
      setLightColors((prevColors) => ({
        ...prevColors,
        [key]: `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`,
      }));
    } else {
      setDarkColors((prevColors) => ({
        ...prevColors,
        [key]: `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`,
      }));
    }
  };

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
              width: 50,
              height: 20,
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
