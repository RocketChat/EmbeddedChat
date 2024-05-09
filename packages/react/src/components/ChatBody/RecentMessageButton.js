import React, { useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { recentMessageStyles as styles } from './ChatBody.styles';

const RecentMessageButton = ({ visible, onClick, text }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <Button
      css={[styles.button, !visible && 'not', clicked && 'clicked']}
      color="primary"
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
