import React from 'react';
import { Box, StaticSelect, useTheme } from '@embeddedchat/ui-elements';
import { getPaletteSettings } from './ThemeLab.styles';
import ColorManager from './ColorManager';
import FontManager from './FontManager';

const ThemeSetting = () => {
  const themeObject = useTheme();
  const styles = getPaletteSettings(themeObject);

  const { mode, setMode } = themeObject;

  const modeOptions = [
    {
      label: 'Light',
      value: 'light',
    },

    {
      label: 'Dark',
      value: 'dark',
    },
  ];

  return (
    <Box css={styles.main}>
      <Box css={styles.colorSection}>
        <h3>Colors</h3>
        <Box css={styles.commonSelect}>
          <Box is="span">
            <b>Mode</b>
          </Box>
          <StaticSelect
            options={modeOptions}
            style={{
              position: 'absolute',
              top: '16px',
              right: 0,
              zIndex: '1',
            }}
            placeholder="Choose"
            value={mode}
            onSelect={setMode}
          />
        </Box>
        <Box css={styles.palette}>
          <Box is="span">
            <b>Palette</b>
          </Box>
          <ColorManager />
        </Box>
      </Box>
      <Box css={styles.typographySection}>
        <h3>Typography</h3>
        <FontManager />
      </Box>
    </Box>
  );
};

export default ThemeSetting;
