import React from 'react';
import { format } from 'date-fns';
import { Button, Icon, useTheme } from '@embeddedchat/ui-elements';

const BubbleThreadBtn = ({ message, handleOpenThread, styles = {} }) => {
  const { theme } = useTheme();

  return (
    <>
      <Icon
        name="arc"
        size="30"
        fill="none"
        color={`${theme.colors.accent}`}
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
