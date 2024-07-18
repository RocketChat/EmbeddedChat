import React from 'react';
import { Box, useTheme, StaticSelect } from '@embeddedchat/ui-elements';
import { getLayoutSettings } from './ThemeLab.styles';

const LayoutSetting = () => {
  const styles = getLayoutSettings(useTheme());

  const messageViewOptions = [
    {
      label: 'Flat',
      value: 'flat',
    },

    {
      label: 'Bubble',
      value: 'bubble',
    },
  ];

  const displayNameOptions = [
    {
      label: 'Normal',
      value: 'normal',
    },

    {
      label: 'Colorize',
      value: 'colorize',
    },
  ];
  return (
    <Box css={styles.main}>
      <Box css={styles.variantSection}>
        <h3>Variants</h3>
        <Box css={[styles.commonSelect, styles.messageView]}>
          <Box is="span">Message View</Box>
          <StaticSelect
            options={messageViewOptions}
            style={{
              position: 'absolute',
              top: '16px',
              right: 0,
              zIndex: '1',
            }}
            placeholder="Choose"
          />
        </Box>

        <Box css={[styles.commonSelect, styles.displayName]}>
          <Box is="span">Display Name</Box>
          <StaticSelect
            options={displayNameOptions}
            style={{ position: 'absolute', top: '16px', right: 0 }}
            placeholder="Choose"
          />
        </Box>
      </Box>

      <Box css={styles.toolSection}>
        <h3>Tool Tray</h3>
      </Box>
    </Box>
  );
};

export default LayoutSetting;
