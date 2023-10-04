/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { Markup } from '../Markup/index';
import { Box } from '../Box';
import { MessageEmoji } from '@rocket.chat/fuselage';

// Define Emotion.sh styles using template literals
const markdownStyles = css`
  p {
    margin: 0;
    padding: 0;
  }

  code {
    font-family: 'Menlo', monospace;
    color: #333;
    border-color: #ccc;
    background-color: #f8f8f8;
    margin: 5px 0;
    padding: 0.5em;
    font-size: 13px;
    font-weight: 600;
  }

  .joypixels {
    height: 1.5rem;
    width: 1.5rem;
    image-rendering: pixelated;
  }

  .joypixels_BigEmoji {
    height: 2.75rem;
    width: 2.75rem;
    image-rendering: pixelated;
  }

  .emojione {
    margin: 0 0.15em;
    vertical-align: middle;
    white-space: nowrap;
    font-size: inherit;
    line-height: normal;
  }
`;

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    return (
      <MessageEmoji>
        <Box
          dangerouslySetInnerHTML={{
            __html: emojione.toImage(body),
          }}
        />
      </MessageEmoji>
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box css={markdownStyles}>
      <Markup tokens={body.md} />
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
