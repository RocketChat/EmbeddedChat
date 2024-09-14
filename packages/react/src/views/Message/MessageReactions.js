import React from 'react';
import {
  Box,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';
import { isSameUser, serializeReactions } from '../../lib/reaction';
import { getMessageReactionsStyles } from './Message.styles';

export const MessageReactions = ({
  message,
  authenticatedUserUsername,
  handleEmojiClick = () => {},
  className = '',
  style = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageReactions',
    className,
    style
  );
  const { theme } = useTheme();
  const styles = getMessageReactionsStyles(theme);
  return (
    <Box
      css={styles.container}
      className={appendClassNames('ec-message-reactions', classNames)}
      style={styleOverrides}
      {...props}
    >
      {message.reactions &&
        serializeReactions(message.reactions).map((reaction) => (
          <Box
            css={
              isSameUser(reaction, authenticatedUserUsername)
                ? [styles.reaction, styles.reactionMine]
                : [styles.reaction]
            }
            key={reaction.name}
            mine={isSameUser(reaction, authenticatedUserUsername)}
            onClick={() =>
              handleEmojiClick(
                reaction,
                message,
                !isSameUser(reaction, authenticatedUserUsername)
              )
            }
          >
            <Markdown body={reaction.name} isReaction />
            <p>{reaction.count}</p>
          </Box>
        ))}
    </Box>
  );
};
