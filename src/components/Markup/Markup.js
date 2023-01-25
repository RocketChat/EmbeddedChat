import PropTypes from 'prop-types';
import React from 'react';
import PreviewInlineElements from './elements/PreviewInlineElements';
import CodeBlock from './elements/CodeBlock';

const Markup = ({ tokens }) =>
  tokens.map((token, index) => {
    switch (token.type) {
      case 'PARAGRAPH':
        return <PreviewInlineElements key={index} contents={token.value} />;

      case 'CODE':
        return <CodeBlock key={index} lines={token.value} />;

      default:
        return null;
    }
  });

export default Markup;

Markup.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.object),
};
