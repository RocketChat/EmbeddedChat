import React, { useState, useMemo } from 'react';
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
  const [hoveredReaction, setHoveredReaction] = useState(null);

  const tooltipMap = useMemo(() => {
    const map = {};
    if (message.reactions) {
      serializeReactions(message.reactions).forEach((reaction) => {
        const usernames = reaction.usernames || [];
        const updatedUsernames = [];
        let isUserIncluded = false;

        usernames.forEach((username) => {
          if (username === authenticatedUserUsername) {
            isUserIncluded = true;
          } else {
            updatedUsernames.push(username);
          }
        });

        if (isUserIncluded) {
          updatedUsernames.unshift('You');
        }

        const visibleNames = updatedUsernames.slice(0, 9);
        const remainingCount = updatedUsernames.length - visibleNames.length;

        let tooltipContent = visibleNames.join(', ');
        if (remainingCount > 0) {
          tooltipContent += `, and ${remainingCount} ${
            remainingCount === 1 ? 'other' : 'others'
          }`;
        }

        map[reaction.name] = `${tooltipContent} reacted with ${reaction.name}`;
      });
    }
    return map;
  }, [message.reactions, authenticatedUserUsername]);

  return (
    <Box
      css={styles.container}
      className={appendClassNames('ec-message-reactions', classNames)}
      style={styleOverrides}
      {...props}
    >
      {message.reactions &&
        serializeReactions(message.reactions).map((reaction) => {
          const isUserReaction = isSameUser(
            reaction,
            authenticatedUserUsername
          );
          return (
            <Box
              key={reaction.name}
              css={
                isUserReaction
                  ? [styles.reaction, styles.reactionMine]
                  : [styles.reaction]
              }
              mine={isUserReaction}
              onClick={() =>
                handleEmojiClick(reaction, message, !isUserReaction)
              }
              onMouseEnter={() => setHoveredReaction(reaction.name)}
              onMouseLeave={() => setHoveredReaction(null)}
              style={{ position: 'relative' }}
            >
              <Markdown body={reaction.name} isReaction />
              <p>{reaction.count}</p>
              {hoveredReaction === reaction.name && (
                <Box css={styles.emojiTooltip}>{tooltipMap[reaction.name]}</Box>
              )}
            </Box>
          );
        })}
    </Box>
  );
};
