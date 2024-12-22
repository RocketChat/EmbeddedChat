import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { Markup, MarkupInteractionContext } from '@embeddedchat/markups/src';
import EmojiReaction from '../EmojiReaction/EmojiReaction';
import { useMemberStore, useUserStore } from '../../store';

const Markdown = ({ body, isReaction = false }) => {
  const members = useMemberStore((state) => state.members);
  const username = useUserStore((state) => state.username);
  const value = useMemo(() => ({ members, username }), [members, username]);

  if (isReaction) {
    return (
      <Box
        css={css`
          font-size: 1rem;
        `}
      >
        <EmojiReaction body={body} />
      </Box>
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <MarkupInteractionContext.Provider value={value}>
        <Markup tokens={body.md} />
      </MarkupInteractionContext.Provider>
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
