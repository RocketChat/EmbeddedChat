import React, { useState } from 'react';
import { Box, StaticSelect, useTheme } from '@embeddedchat/ui-elements';
import { getFontManagerStyles } from './ThemeLab.styles';

const FontManager = () => {
  const themeObj = useTheme();
  const styles = getFontManagerStyles(themeObj);
  const { theme, setTheme } = themeObj;

  const fontFamilyOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
    { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif' },
    { label: 'Courier New', value: '"Courier New", Courier, monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Impact', value: 'Impact, Charcoal, sans-serif' },
    { label: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
    {
      label: 'Lucida Sans Unicode',
      value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    },
    {
      label: 'Palatino Linotype',
      value: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    },
    { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
    { label: 'Times New Roman', value: "'Times New Roman', serif" },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'MS Sans Serif', value: '"MS Sans Serif", Geneva, sans-serif' },
    { label: 'MS Serif', value: '"MS Serif", "New York", serif' },
  ];

  const fontSizeOptions = [
    { label: 'Small', value: 12 },
    { label: 'Medium', value: 16 },
    { label: 'Large', value: 20 },
    { label: 'Extra Large', value: 24 },
  ];

  const fontWeightOptions = [
    { label: 'Light', value: 300 },
    { label: 'Normal', value: 400 },
    { label: 'Bold', value: 700 },
    { label: 'Extra Bold', value: 900 },
  ];

  const [fontFamily, setFontFamily] = useState(
    theme.typography.default.fontFamily
  );
  const [fontSize, setFontSize] = useState(
    theme.typography.default.fontSize || '16'
  );
  const [fontWeight, setFontWeight] = useState(
    theme.typography.default.fontWeightRegular || 400
  );

  const handleFontFamilyChange = (selectedOption) => {
    setFontFamily(selectedOption);
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        default: {
          ...theme.typography.default,
          fontFamily: selectedOption,
        },
      },
    });
  };

  const handleFontSizeChange = (selectedOption) => {
    setFontSize(selectedOption);
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        default: {
          ...theme.typography.default,
          fontSize: selectedOption,
        },
      },
    });
  };

  const handleFontWeightChange = (selectedOption) => {
    setFontWeight(selectedOption);
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        default: {
          ...theme.typography.default,
          fontWeightRegular: selectedOption,
        },
      },
    });
  };

  return (
    <Box>
      <Box css={styles.commonSelect}>
        <Box is="span">
          <b>Font Family</b>
        </Box>
        <StaticSelect
          options={fontFamilyOptions}
          style={{ position: 'absolute', top: '16px', right: 0, zIndex: 2 }}
          placeholder="Choose"
          value={fontFamily}
          onSelect={handleFontFamilyChange}
        />
      </Box>
      <Box css={styles.commonSelect}>
        <Box is="span">
          <b>Font Size</b>
        </Box>
        <StaticSelect
          options={fontSizeOptions}
          style={{ position: 'absolute', top: '16px', right: 0, zIndex: 1 }}
          placeholder="Choose"
          value={fontSize}
          onSelect={handleFontSizeChange}
        />
      </Box>
      <Box css={styles.commonSelect}>
        <Box is="span">
          <b>Font Weight</b>
        </Box>
        <StaticSelect
          options={fontWeightOptions}
          style={{ position: 'absolute', top: '16px', right: 0 }}
          placeholder="Choose"
          value={fontWeight}
          onSelect={handleFontWeightChange}
        />
      </Box>
    </Box>
  );
};

export default FontManager;
