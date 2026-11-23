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
import Attachment from '../AttachmentHandler/Attachment';
import FileAttachment from '../AttachmentHandler/TextAttachment';
import { Markdown } from '../Markdown';

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const instanceHost = RCInstance.getHost();
  const getUserAvatarUrl = (username) =>
    username ? `${instanceHost}/avatar/${username}` : '';
  const author = {
    authorIcon: message?.author_icon,
    authorName: message?.author_name,
  };
  const { theme } = useTheme();
  const styles = getQuoteMessageStyles(theme);
  const removeQuoteMessage = useMessageStore(
    (state) => state.removeQuoteMessage
  );

  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');

  if (!message) {
    return null;
  }

  const messageTime =
    message?.ts && !Number.isNaN(new Date(message.ts).getTime())
      ? format(new Date(message.ts), 'h:mm a')
      : '';
  const fileType = message.file?.type || '';

  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.messageContainer}
    >
      <Box css={styles.actionBtn}>
        <ActionButton
          ghost
          onClick={() => removeQuoteMessage(message)}
          size="small"
          aria-label="Remove quote"
        >
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
      <Box css={styles.avatarContainer}>
        <Avatar
          url={getUserAvatarUrl(message?.u?.username)}
          alt="avatar"
          size="1.5em"
        />
        <Box>{message?.u?.username}</Box>
        <Box>{messageTime}</Box>
      </Box>
      <Box css={styles.message}>
        {message.file ? (
          fileType.startsWith('image/') ? (
            <div>
              <img
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                alt={message.file.name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
              <div>{`${message.file.name} (${(message.file.size / 1024).toFixed(
                2
              )} kB)`}</div>
            </div>
          ) : fileType.startsWith('video/') ? (
            <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={fileType}
              />
              Your browser does not support the video tag.
            </video>
          ) : fileType.startsWith('audio/') ? (
            <audio controls style={{ maxWidth: '100%' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={fileType}
              />
              Your browser does not support the audio element.
            </audio>
          ) : fileType.startsWith('application/') ||
            fileType.startsWith('text/') ? (
            <FileAttachment
              attachment={message.attachments?.[0]}
              host={instanceHost}
              type={message.attachments?.[0]?.type}
              msg={message}
              author={author}
            />
          ) : (
            <Box css={styles.message}>
              {message.msg ? (
                <Markdown body={message} md={message.md} isReaction={false} />
              ) : (
                `${message.file?.name || 'File'} (${
                  message.file?.size ? (message.file.size / 1024).toFixed(2) : 0
                } kB)`
              )}
            </Box>
          )
        ) : message?.msg?.[0] === '[' ? (
          message.msg.match(/\n(.*)/)?.[1] || message.msg
        ) : (
          <Markdown body={message} md={message.md} isReaction={false} />
        )}
        {message.attachments &&
          message.attachments.length > 0 &&
          message.msg &&
          message.msg?.[0] === '[' &&
          message.attachments.map((attachment, index) => (
            <Attachment
              key={index}
              attachment={attachment}
              type={attachment.type}
              host={instanceHost}
            />
          ))}
      </Box>
    </Box>
  );
};

export default QuoteMessage;
