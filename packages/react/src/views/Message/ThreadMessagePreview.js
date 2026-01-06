import React from 'react';
import {
  appendClassNames,
  Box,
  Icon,
  Skeleton,
} from '@embeddedchat/ui-elements';
import { ThreadMessageAvatarContainer } from './ThreadMessageAvatarContainer';
import { getThreadPreviewContainerStyles } from './Message.styles';
import useMessageStore from '../../store/messageStore';

export const ThreadMessagePreview = ({
  message,
  showUserAvatar,
  sequential,
  prev,
  ...props
}) => {
  const styles = getThreadPreviewContainerStyles();
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages);
  const parentMessage = messages.find((msg) => msg._id === message.tmid);

  return (
    <>
      {sequential ? (
        <Box className={appendClassNames('ec-message')} css={styles.container}>
          <ThreadMessageAvatarContainer
            message={message}
            sequential={sequential}
          />
          <Box css={{ display: 'inline' }}>{message.msg}</Box>
        </Box>
      ) : (
        <Box>
          <Box>
            {parentMessage && parentMessage._id !== prev?._id && (
              <Box css={styles.container}>
                <Icon name="thread" size="1.2em" />
                {parentMessage.msg}
              </Box>
            )}
            <Box css={styles.container}>
              <Box>
                <ThreadMessageAvatarContainer
                  message={message}
                  sequential={sequential}
                />
              </Box>
              <Box css={{ display: 'inline' }}>{message.msg}</Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
