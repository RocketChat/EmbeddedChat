import React from 'react';
import './Markdown.css';
import { CustomEmojiPicker } from '../EmojiPicker/EmojiPicker';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { Markup } from '../Markup/index';
import { Box } from '../Box';

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    return (
      <CustomEmojiPicker>
        <Box
          dangerouslySetInnerHTML={{
            __html: emojione.toImage(body),
          }}
        />
      </CustomEmojiPicker>
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <Markup tokens={body.md} />
    </Box>
  );
};
export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};
