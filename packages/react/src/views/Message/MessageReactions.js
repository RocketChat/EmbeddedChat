import React, { useState } from 'react';
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
  const tooltipMap = {};
  const getTooltipContent = (reaction) => {
    const usernames = [...(reaction.usernames || [])];
    const userIndex = usernames.indexOf(authenticatedUserUsername);
    if (userIndex !== -1) {
      usernames.splice(userIndex, 1);
      usernames.unshift('You');
    }
    const visibleNames = usernames.slice(0, 9);
    const remainingCount = usernames.length - visibleNames.length;
    let tooltipContent = visibleNames.join(', ');
    if (remainingCount > 0) {
      tooltipContent += `, and ${remainingCount} ${
        remainingCount === 1 ? 'other' : 'others'
      }`;
    }
    tooltipMap[
      reaction.name
    ] = `${tooltipContent} reacted with ${reaction.name}`;
    return tooltipMap[reaction.name];
  };
  message.reactions &&
    serializeReactions(message.reactions).forEach((reaction) => {
      getTooltipContent(reaction);
    });

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
            key={reaction.name}
            css={
              isSameUser(reaction, authenticatedUserUsername)
                ? [styles.reaction, styles.reactionMine]
                : [styles.reaction]
            }
            mine={isSameUser(reaction, authenticatedUserUsername)}
            onClick={() =>
              handleEmojiClick(
                reaction,
                message,
                !isSameUser(reaction, authenticatedUserUsername)
              )
            }
            onMouseEnter={() => setHoveredReaction(reaction.name)}
            onMouseLeave={() => setHoveredReaction(null)}
            style={{ position: 'relative' }}
          >
            <Markdown body={reaction.name} isReaction titleTagVisible={false} />
            <p>{reaction.count}</p>
            {hoveredReaction === reaction.name && (
              <Box css={styles.emojiTooltip}>{tooltipMap[reaction.name]}</Box>
            )}
          </Box>
        ))}
    </Box>
  );
};
