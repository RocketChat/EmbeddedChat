import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import StrikeSpan from './StrikeSpan';
import CodeElement from './CodeElement';
import Emoji from './Emoji';
import ChannelMention from '../mentions/ChannelMention';
import UserMention from '../mentions/UserMention';

const ItalicSpan = ({ contents }) => (
  <em>
    {contents.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} contents={content.value} />;

        case 'STRIKE':
          return <StrikeSpan key={index} contents={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} contents={content.value} />;

        case 'INLINE_CODE':
          return <CodeElement key={index} contents={content.value} />;

        case 'EMOJI':
          return <Emoji key={index} emoji={content} />;

        case 'MENTION_CHANNEL':
          return <ChannelMention key={index} mention={content.value.value} />;

        case 'MENTION_USER':
          return <UserMention key={index} contents={content.value} />;

        default:
          return null;
      }
    })}
  </em>
);

export default ItalicSpan;

ItalicSpan.propTypes = {
  contents: PropTypes.any,
};
