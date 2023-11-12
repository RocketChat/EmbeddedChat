import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Markdown } from '../Markdown';
import { isSameUser, serializeReactions } from '../../lib/reaction';

const MessageReactionsCss = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: -0.125rem;
`;

const MessageReactionCss = css`
  letter-spacing: 0rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  display: inline-flex;
  align-items: center;
  margin: 0.125rem;
  padding: 0.125rem;
  cursor: pointer;
  color: #6c727a;
  border: 1px solid #cbced1;
  border-radius: 0.25rem;
  background-color: #f7f8fa;
  &:hover {
    border-color: #6c727a;
    background-color: #f2f3f5;
  }
`;

const MessageReactionMineCss = css`
  color: #2f343d;
  border-width: 1px;
`;

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
  return (
    <Box
      css={MessageReactionsCss}
      className={appendClassNames('ec-message-reactions', classNames)}
      style={styleOverrides}
      {...props}
    >
      {message.reactions &&
        serializeReactions(message.reactions).map((reaction) => (
          <Box
            css={
              isSameUser(reaction, authenticatedUserUsername)
                ? [MessageReactionCss, MessageReactionMineCss]
                : [MessageReactionCss]
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

