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

  const [fontFamily, setFontFamily] = useState(
    theme.typography.default.fontFamily
  );

  const handleFontChange = (selectedOption) => {
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

  return (
    <Box css={styles.commonSelect}>
      <Box is="span">
        <b>Font Family</b>
      </Box>
      <StaticSelect
        options={fontFamilyOptions}
        style={{
          position: 'absolute',
          top: '16px',
          right: 0,
          zIndex: '1',
        }}
        placeholder="Choose"
        value={fontFamily}
        onSelect={handleFontChange}
      />
    </Box>
  );
};

export default FontManager;
