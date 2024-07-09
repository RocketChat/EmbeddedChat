import React, { useState } from 'react';
import { Box, Button, Icon } from '@embeddedchat/ui-elements';
import { useRecentMessageStyles } from './ChatBody.styles';

const RecentMessageButton = ({ visible, onClick, text }) => {
  const [clicked, setClicked] = useState(false);
  const styles = useRecentMessageStyles();
  return (
    <Button
      css={[styles.button, !visible && 'not', clicked && 'clicked']}
      type="primary"
      size="small"
      onClick={() => {
        onClick();
        setClicked(true);
      }}
    >
      <Box css={styles.textIconContainer}>
        {text}
        <Icon name="arrow-down" size={16} />
      </Box>
    </Button>
  );
};

export default RecentMessageButton;
