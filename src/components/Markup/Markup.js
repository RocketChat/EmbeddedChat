import PropTypes from 'prop-types';
import React from 'react';
import PreviewInlineElements from './elements/PreviewInlineElements';
import CodeBlock from './elements/CodeBlock';
import BigEmoji from './elements/BigEmoji';

const Markup = ({ tokens }) =>
  tokens.map((token, index) => {
    switch (token.type) {
      case 'PARAGRAPH':
        return <PreviewInlineElements key={index} contents={token.value} />;

      case 'CODE':
        return <CodeBlock key={index} lines={token.value} />;

      case 'BIG_EMOJI':
        return <BigEmoji key={index} contents={token.value} />;

      default:
        return null;
    }
  });

export default Markup;

Markup.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
};
