import React from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { getPaletteSettings } from './ThemeLab.styles';

const PaletteSetting = () => {
  const styles = getPaletteSettings(useTheme());
  return (
    <Box css={styles.main}>
      <Box css={styles.colorSection}>
        <h3>Colors</h3>
      </Box>
      <Box css={styles.typographySection}>
        <h3>Typography</h3>
      </Box>
    </Box>
  );
};

export default PaletteSetting;
