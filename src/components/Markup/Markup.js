import PropTypes from 'prop-types';
import React from 'react';
import CodeBlock from './elements/CodeBlock';
import BigEmoji from './elements/BigEmoji';
import Paragraph from './elements/Paragraph';

const Markup = ({ tokens }) =>
  tokens.map((token, index) => {
    switch (token.type) {
      case 'PARAGRAPH':
        return <Paragraph key={index} contents={token.value} />;

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
