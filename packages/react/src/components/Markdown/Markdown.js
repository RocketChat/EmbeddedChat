import React from 'react';
import PropTypes from 'prop-types';
import { Markup } from '../Markup/index';
import { Box } from '../Box';
import { css } from '@emotion/react'; // Import Emotion's css function
import { markdownStyles } from './Markdown.styles'; // Import Emotion styles
import MessageEmoji from '../MessageEmoji/MessageEmoji';


const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    return (
      <MessageEmoji body={body} />
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <Markup tokens={body.md} />
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
