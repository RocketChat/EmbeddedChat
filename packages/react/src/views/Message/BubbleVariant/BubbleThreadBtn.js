import React from 'react';
import { format } from 'date-fns';
import { Button, Icon } from '@embeddedchat/ui-elements';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

const BubbleThreadBtn = ({ message, handleOpenThread, styles = {} }) => {
  const { colors } = useCustomTheme();

  return (
    <>
      <Icon
        name="arc"
        size="30"
        fill="none"
        color={`${colors.accent}`}
        css={styles.arcIcon}
      />
      <Button
        size="small"
        onClick={handleOpenThread(message)}
        css={styles && styles.threadReplyButton}
      >
        {message.tcount} Replies
        <span style={{ margin: '0 0.25rem' }}>
          {format(new Date(message.tlm), 'hh:mm a')}
        </span>
      </Button>
    </>
  );
};

export default BubbleThreadBtn;
