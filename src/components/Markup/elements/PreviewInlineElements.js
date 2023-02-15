import React from 'react';
import PlainSpan from './PlainSpan';
import ItalicSpan from './ItalicSpan';
import StrikeSpan from './StrikeSpan';
import BoldSpan from './BoldSpan';
import CodeElement from './CodeElement';
import Emoji from './Emoji';
import Mention from './Mention';
import PropTypes from 'prop-types';

const PreviewInlineElements = ({ contents, members }) => {
  return (
    <>
      {contents.map((content, index) => {
        switch (content.type) {
          case 'BOLD':
            return <BoldSpan key={index} contents={content.value} />;

          case 'PLAIN_TEXT':
            return <PlainSpan key={index} contents={content.value} />;

          case 'STRIKE':
            return <StrikeSpan key={index} contents={content.value} />;

          case 'ITALIC':
            return <ItalicSpan key={index} contents={content.value} />;

          case 'INLINE_CODE':
            return <CodeElement key={index} contents={content.value} />;

          case 'EMOJI':
            return <Emoji key={index} emoji={content} />;

          case 'MENTION_USER':
            return (
              <Mention key={index} contents={content.value} members={members} />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
export default PreviewInlineElements;
PreviewInlineElements.propTypes = {
  contents: PropTypes.any,
  members: PropTypes.any,
};
