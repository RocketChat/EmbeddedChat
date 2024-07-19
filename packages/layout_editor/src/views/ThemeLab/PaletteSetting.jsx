import React from 'react';
import { Box, StaticSelect, useTheme } from '@embeddedchat/ui-elements';
import { getPaletteSettings } from './ThemeLab.styles';

const PaletteSetting = () => {
  const theme = useTheme();
  const styles = getPaletteSettings(theme);

  const { mode, setMode } = theme;

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
          <Box is="span">Mode</Box>
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
      </Box>
      <Box css={styles.typographySection}>
        <h3>Typography</h3>
      </Box>
    </Box>
  );
};

export default PaletteSetting;
