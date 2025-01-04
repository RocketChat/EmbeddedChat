import React from 'react';
import PropTypes from 'prop-types';
import ParagraphBlock from './ParagraphBlock';
import { css } from '@emotion/react';
import { useTheme } from '@embeddedchat/ui-elements';

const QuoteBlock = ({ contents }) => {
  const { theme } = useTheme();
  return (
    <blockquote
      css={css`
        background-color: ${theme.colors.secondary};
        border-left: 1.5px solid ${theme.colors.primary};
        padding-left: 0.5rem;
      `}
    >
      {contents.map((paragraph, index) => (
        <ParagraphBlock key={index} contents={paragraph.value} />
      ))}
    </blockquote>
  );
};

export default QuoteBlock;

QuoteBlock.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.shape),
};
