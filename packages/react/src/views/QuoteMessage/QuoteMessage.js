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
import { useUserStore } from '../../store';
import { useSidebarStore } from '../../store';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import getQuoteMessageStyles from './QuoteMessage.styles';
import Attachment from '../AttachmentHandler/Attachment';
import FileAttachment from '../AttachmentHandler/TextAttachment';
import { Markdown } from '../Markdown';

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const instanceHost = RCInstance.getHost();
  const getUserAvatarUrl = (username) => {
    const host = instanceHost;
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const author = {
    authorIcon: message?.author_icon,
    authorName: message?.author_name,
  };
  const { theme } = useTheme();
  const styles = getQuoteMessageStyles(theme);
  const removeQuoteMessage = useMessageStore(
    (state) => state.removeQuoteMessage
  );

  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));
  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);

  const handleAvatarClick = async () => {
    const username =
      message?.u?.username || message?.username || message?.author_name;
    if (!username) return;

    // Open sidebar immediately so UI doesn't depend on async userData fetch.
    setExclusiveState(setShowCurrentUserInfo);
    setShowCurrentUserInfo(true);
    setShowSidebar(true);

    // Set a fallback user first to ensure UserInformation renders.
    setCurrentUser({
      _id: message?.u?._id,
      username,
      name: message?.u?.name || username,
    });

    try {
      const res = await RCInstance.userData(username);
      if (res?.user) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser({
          _id: message?.u?._id,
          username,
          name: message?.u?.name || username,
        });
      }
    } catch {
      setCurrentUser({
        _id: message?.u?._id,
        username,
        name: message?.u?.name || username,
      });
    }
  };

  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
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
        >
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
      <Box css={styles.avatarContainer}>
        <Box
          onClick={handleAvatarClick}
          css={styles.avatarContainer}
          style={{ cursor: 'pointer', alignItems: 'center' }}
        >
          <Avatar
            url={getUserAvatarUrl(message?.u.username)}
            alt="avatar"
            size="1.5em"
          />
          {message?.u.username}
        </Box>
        <Box>{format(new Date(message.ts), 'h:mm a')}</Box>
      </Box>
      <Box css={styles.message}>
        {message.file ? (
          message.file.type.startsWith('image/') ? (
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
          ) : message.file.type.startsWith('video/') ? (
            <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={message.file.type}
              />
              Your browser does not support the video tag.
            </video>
          ) : message.file.type.startsWith('audio/') ? (
            <audio controls style={{ maxWidth: '100%' }}>
              <source
                src={`${instanceHost}/file-upload/${message.file._id}/${message.file.name}`}
                type={message.file.type}
              />
              Your browser does not support the audio element.
            </audio>
          ) : message.file.type.startsWith('application/') ||
            message.file.type.startsWith('text/') ? (
            <FileAttachment
              attachment={message.attachments[0]}
              host={instanceHost}
              type={message.attachments[0].type}
              msg={message}
              author={author}
            />
          ) : (
            <Box css={styles.message}>
              {message.msg ? (
                <Markdown body={message} md={message.md} isReaction={false} />
              ) : (
                `${message.file?.name} (${
                  message.file?.size ? (message.file.size / 1024).toFixed(2) : 0
                } kB)`
              )}
            </Box>
          )
        ) : message?.msg[0] === '[' ? (
          message?.msg.match(/\n(.*)/)[1]
        ) : (
          <Markdown body={message} md={message.md} isReaction={false} />
        )}
        {message.attachments &&
          message.attachments.length > 0 &&
          message.msg &&
          message.msg[0] === '[' &&
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
