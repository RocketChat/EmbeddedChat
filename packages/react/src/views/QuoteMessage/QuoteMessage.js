import React, { useContext } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Avatar,
  ActionButton,
  Icon,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';
import getQuoteMessageStyles from './QuoteMessage.styles';

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const { theme } = useTheme();
  const styles = getQuoteMessageStyles(theme);
  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);

  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');

  // Function to render the message content or attachment preview
  const renderMessageContent = () => {
    if (message.file) {
      const fileUrl = `${RCInstance.getHost()}/file-upload/${
        message.file._id
      }/${message.file.name}`;
      if (message.file.type.startsWith('video/')) {
        return (
          <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
            <source src={fileUrl} type={message.file.type} />
            Your browser does not support the video tag.
          </video>
        );
      }
      if (message.file.type.startsWith('image/')) {
        return (
          <div>
            <img
              src={fileUrl}
              alt={message.file.name}
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
            <div>{`${message.file.name} (${(message.file.size / 1024).toFixed(
              2
            )} kB)`}</div>
          </div>
        );
      }
      if (message.file.type.startsWith('audio/')) {
        return (
          <audio controls style={{ maxWidth: '100%' }}>
            <source src={fileUrl} type={message.file.type} />
            Your browser does not support the audio element.
          </audio>
        );
      }
      return (
        <Box css={styles.message}>
          {message.msg
            ? message.msg
            : `${message.file?.name} (${
                message.file?.size ? (message.file.size / 1024).toFixed(2) : 0
              } kB)`}
        </Box>
      );
    }
    return message.msg;
  };

  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.messageContainer}
    >
      <Box css={styles.actionBtn}>
        <ActionButton ghost onClick={() => setQuoteMessage({})} size="small">
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
      <Box css={styles.avatarContainer}>
        <Avatar
          url={getUserAvatarUrl(message?.u.username)}
          alt="avatar"
          size="1.5em"
        />
        <Box>{message?.u.username}</Box>
        <Box>{format(new Date(message.ts), 'h:mm a')}</Box>
      </Box>
      <Box css={styles.message}>{renderMessageContent()}</Box>
    </Box>
  );
};

export default QuoteMessage;
